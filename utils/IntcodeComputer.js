const chalk = require('chalk');
const log = console.log;

const askQuestion = (question, transform = x => x) => {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        readline.question(question, response => {
            readline.close();
            let transformed;
            try {
                transformed = transform(response);
            } catch (err) {
                reject(err);
            }
            resolve(transformed);
        });
    });
};

class IntcodeComputer {
    constructor(program, opts = {}) {
        this.memory = program;
        this.pointer = 0;
        this.opcode = null;
        this.pointerModified = false;
        this.stopped = false;

        this.options = {
            debug: false,
            ...opts,
        };

        this.nextInstruction();
    }

    debug(msg) {
        if (this.options.debug) {
            log(msg);
        }
    }

    /**
     * Set the opcode based on the current instruction
     */
    setOpcode() {
        if (!this.instruction) {
            return;
        }
        const inst = this.instruction.toString().padStart(4, '0');
        const [modes, code] = inst.match(/.{2}/g);

        this.opcode = this.opcodes[code];
        this.parameterModes = modes
            .split('')
            .reverse()
            .map(mode => parseInt(mode, 10));
    }

    setPointer() {
        if (!this.pointerModified) {
            this.pointer += this.opcode.instructionLength;
        }
        this.pointerModified = false;
    }

    setInstruction() {
        this.instruction = this.memory[this.pointer];
    }

    setParams() {
        if (!this.opcode) {
            return;
        }

        this.params = [];
        for (let i = 1; i <= this.opcode.paramsLength; i += 1) {
            const param = this.memory[this.pointer + i];
            const mode = this.parameterModes[i - 1] || 0;
            this.params.push(mode === 1 ? param : this.memory[param]);
        }
    }

    setAddress(address, value) {
        this.debug(chalk`Setting address {bold ${address}} to {bold ${value}}`);
        this.memory[address] = value;
    }

    async getInput() {
        try {
            const input = await askQuestion('Input: ', response => {
                if (!/^\d+$/.test(response)) {
                    throw new Error('Input must be an integer');
                }
                return parseInt(response, 10);
            });
            const address = this.memory[this.pointer + 1];
            this.memory[address] = input;
        } catch (err) {
            log(err.message);
        }
    }

    add() {
        const address = this.memory[this.pointer + 3];
        this.setAddress(address, this.params[0] + this.params[1]);
    }

    multiply() {
        const address = this.memory[this.pointer + 3];
        this.setAddress(address, this.params[0] * this.params[1]);
    }

    output() {
        log(this.params[0]);
    }

    jumpIfTrue() {
        if (this.params[0] !== 0) {
            this.pointer = this.params[1];
            this.pointerModified = true;
        }
    }

    jumpIfFalse() {
        if (this.params[0] === 0) {
            this.pointer = this.params[1];
            this.pointerModified = true;
        }
    }

    lessThan() {
        const address = this.memory[this.pointer + 3];
        this.setAddress(address, this.params[0] < this.params[1] ? 1 : 0);
    }

    equals() {
        const address = this.memory[this.pointer + 3];
        this.setAddress(address, this.params[0] === this.params[1] ? 1 : 0);
    }

    nextInstruction() {
        this.setInstruction();
        this.setOpcode();
        this.setParams();
    }

    async run() {
        while (this.instruction !== undefined && !this.stopped) {
            this.debug(this.instruction, this.opcode.type, this.params);

            switch (this.opcode.type) {
                case 'ADD':
                    this.add();
                    break;

                case 'MULTIPLY':
                    this.multiply();
                    break;

                case 'INPUT':
                    await this.getInput();
                    break;

                case 'OUTPUT':
                    this.output();
                    break;

                case 'JUMP-IF-TRUE':
                    this.jumpIfTrue();
                    break;

                case 'JUMP-IF-FALSE':
                    this.jumpIfFalse();
                    break;

                case 'LESS THAN':
                    this.lessThan();
                    break;

                case 'EQUALS':
                    this.equals();
                    break;

                case 'STOP':
                    this.stopped = true;
                    break;

                default:
                    log(
                        chalk`{red Unexpected opcode: {bold ${
                            this.instruction
                        }}}`
                    );
            }

            this.setPointer();
            this.nextInstruction();
        }

        this.done();

        return Promise.resolve(this.memory);
    }

    done() {
        this.debug('Finished');
    }
}

IntcodeComputer.prototype.opcodes = {
    '01': {
        instructionLength: 4,
        paramsLength: 2,
        type: 'ADD',
    },
    '02': {
        instructionLength: 4,
        paramsLength: 2,
        type: 'MULTIPLY',
    },
    '03': {
        instructionLength: 2,
        paramsLength: 1,
        type: 'INPUT',
    },
    '04': {
        instructionLength: 2,
        paramsLength: 1,
        type: 'OUTPUT',
    },
    '05': {
        instructionLength: 3,
        paramsLength: 2,
        type: 'JUMP-IF-TRUE',
    },
    '06': {
        instructionLength: 3,
        paramsLength: 2,
        type: 'JUMP-IF-FALSE',
    },
    '07': {
        instructionLength: 4,
        paramsLength: 2,
        type: 'LESS THAN',
    },
    '08': {
        instructionLength: 4,
        paramsLength: 2,
        type: 'EQUALS',
    },
    '99': {
        instructionLength: 1,
        paramsLength: 0,
        type: 'STOP',
    },
};

module.exports = IntcodeComputer;
