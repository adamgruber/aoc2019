const chalk = require('chalk');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const program = require('./program');

const log = console.log;

const askQuestion = (question, transform = x => x) =>
    new Promise((resolve, reject) => {
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

class IntcodeComputer {
    constructor(program) {
        this.memory = program;
        this.pointer = 0;
        this.instruction = this.memory[this.pointer];
        this.opcode = {};
        this.pointerModified = false;
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

    add() {
        const params = [];
        for (let i = 1; i <= 2; i += 1) {
            const param = this.memory[this.pointer + i];
            const mode = this.parameterModes[i - 1] || 0;
            params.push(mode === 1 ? param : this.memory[param]);
        }
        const address = this.memory[this.pointer + 3];
        this.memory[address] = params[0] + params[1];
    }

    multiply() {
        const params = [];
        for (let i = 1; i <= 2; i += 1) {
            const param = this.memory[this.pointer + i];
            const mode = this.parameterModes[i - 1] || 0;
            params.push(mode === 1 ? param : this.memory[param]);
        }
        const address = this.memory[this.pointer + 3];
        this.memory[address] = params[0] * params[1];
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

    output() {
        const address = this.memory[this.pointer + 1];
        const value = this.memory[address];
        log(value);
    }

    jumpIfTrue() {
        const params = [];
        for (let i = 1; i <= 2; i += 1) {
            const param = this.memory[this.pointer + i];
            const mode = this.parameterModes[i - 1] || 0;
            params.push(mode === 1 ? param : this.memory[param]);
        }
        if (params[0] !== 0) {
            this.pointer = params[1];
            this.pointerModified = true;
        }
    }

    jumpIfFalse() {
        const params = [];
        for (let i = 1; i <= 2; i += 1) {
            const param = this.memory[this.pointer + i];
            const mode = this.parameterModes[i - 1] || 0;
            params.push(mode === 1 ? param : this.memory[param]);
        }
        if (params[0] === 0) {
            this.pointer = params[1];
            this.pointerModified = true;
        }
    }

    lessThan() {
        const params = [];
        for (let i = 1; i <= 2; i += 1) {
            const param = this.memory[this.pointer + i];
            const mode = this.parameterModes[i - 1] || 0;
            params.push(mode === 1 ? param : this.memory[param]);
        }
        const address = this.memory[this.pointer + 3];
        if (params[0] < params[1]) {
            this.memory[address] = 1;
        } else {
            this.memory[address] = 0;
        }
    }

    equals() {
        const params = [];
        for (let i = 1; i <= 2; i += 1) {
            const param = this.memory[this.pointer + i];
            const mode = this.parameterModes[i - 1] || 0;
            params.push(mode === 1 ? param : this.memory[param]);
        }
        const address = this.memory[this.pointer + 3];
        if (params[0] === params[1]) {
            this.memory[address] = 1;
        } else {
            this.memory[address] = 0;
        }
    }

    async run() {
        this.setOpcode();

        try {
            while (this.opcode && this.instruction !== undefined) {
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
                        break;

                    default:
                        log(
                            chalk`{red Unexpected opcode: {bold ${this.instruction}}}`
                        );
                }

                this.setPointer();
                this.setInstruction();
                this.setOpcode();
            }

            this.done();
        } catch (err) {
            console.log('caught err', err);
        }
    }

    done() {
        console.log('Finished');
    }
}

IntcodeComputer.prototype.opcodes = {
    '01': {
        instructionLength: 4,
        paramsLength: 3,
        type: 'ADD',
    },
    '02': {
        instructionLength: 4,
        paramsLength: 3,
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
        type: 'JUMP-IF-TRUE',
    },
    '06': {
        instructionLength: 3,
        type: 'JUMP-IF-FALSE',
    },
    '07': {
        instructionLength: 4,
        type: 'LESS THAN',
    },
    '08': {
        instructionLength: 4,
        type: 'EQUALS',
    },
    '99': {
        instructionLength: 1,
        paramsLength: 0,
        type: 'STOP',
    },
};

const computer = new IntcodeComputer(program);
computer.run().then(() => {
    process.exit();
});
