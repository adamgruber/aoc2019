const chalk = require('chalk');
const { parseIntcode } = require('./index');

const log = console.log;
const DEBUG_LEVELS = ['none', 'info', 'verbose'];

class IntcodeComputer {
    constructor(program, opts = {}) {
        if (typeof program === 'string') {
            program = parseIntcode(program);
        }
        this.memory = [...program];
        this.pointer = 0;
        this.relativeBase = 0;
        this.opcode = null;
        this.pointerModified = false;
        this.stopped = false;
        this.waiting = false;
        this.outputValues = [];

        this.options = {
            debugLevel: 'none',
            inputs: [],
            done() {},
            onOutput() {},
            ...opts,
        };

        this.inputs = this.options.inputs;

        this.nextInstruction();
    }

    info(msg) {
        if (this.options.debugLevel !== 'none') {
            log(msg);
        }
    }

    debug(msg) {
        if (this.options.debugLevel === 'verbose') {
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
        const inst = this.instruction.toString().padStart(5, '0');
        const code = inst.slice(-2);
        const modes = inst.slice(0, 3);

        this.opcode = this.opcodes[code] || {};
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

        const { POSITION, IMMEDIATE, RELATIVE } = this.modes;

        this.params = [];
        const { paramsLength } = this.opcode;
        for (let i = 1; i <= paramsLength; i += 1) {
            const param = this.getAddress(this.pointer + i);
            const mode = this.parameterModes[i - 1] || 0;

            switch (mode) {
                case POSITION:
                    this.params.push(this.getAddress(param));
                    break;

                case IMMEDIATE:
                    this.params.push(param);
                    break;

                case RELATIVE:
                    this.params.push(
                        this.getAddress(this.relativeBase + param)
                    );
                    break;

                default:
                // Unexpected
            }
        }

        if (this.opcode.write) {
            const idx = paramsLength + 1;
            const param = this.getAddress(this.pointer + idx);
            const mode = this.parameterModes[this.opcode.paramsLength];
            if (mode === RELATIVE) {
                this.params.push(this.relativeBase + param);
            } else {
                this.params.push(param);
            }
        }
    }

    setAddress(address, value) {
        this.debug(chalk`Setting address {bold ${address}} to {bold ${value}}`);
        this.memory[address] = value;
    }

    setInput() {
        if (!this.inputs.length) {
            this.info(chalk`{yellow WARNING: No inputs founds}`);
            this.waiting = true;
            return;
        }

        const input = this.inputs.shift();
        const address = this.params[0];

        this.debug(
            chalk`Setting input {bold ${input}} at address {bold ${address}}`
        );
        this.setAddress(address, input);
        this.waiting = false;
    }

    getAddress(address) {
        return this.memory[address];
    }

    adjustRelativeBase() {
        this.relativeBase += this.params[0];
        this.debug(
            chalk`Relative Base adjusted to {bold ${this.relativeBase}}`
        );
    }

    add() {
        this.setAddress(this.params[2], this.params[0] + this.params[1]);
    }

    multiply() {
        this.setAddress(this.params[2], this.params[0] * this.params[1]);
    }

    output() {
        const value = this.params[0];
        // Add output value to list of stored outputs
        this.outputValues.push(value);

        // Call callback fn
        this.options.onOutput(value);

        // Output to console
        this.info(chalk`Output: {bold ${value}}`);
    }

    jumpIfTrue() {
        if (this.params[0] !== 0) {
            const newPointer = this.params[1];
            this.debug(chalk`Setting pointer to {bold ${newPointer}}`);
            this.pointer = newPointer;
            this.pointerModified = true;
        }
    }

    jumpIfFalse() {
        if (this.params[0] === 0) {
            const newPointer = this.params[1];
            this.debug(chalk`Setting pointer to {bold ${newPointer}}`);
            this.pointer = newPointer;
            this.pointerModified = true;
        }
    }

    lessThan() {
        this.setAddress(
            this.params[2],
            this.params[0] < this.params[1] ? 1 : 0
        );
    }

    equals() {
        this.setAddress(
            this.params[2],
            this.params[0] === this.params[1] ? 1 : 0
        );
    }

    nextInstruction() {
        this.setInstruction();
        this.setOpcode();
        this.setParams();
    }

    run(inputs = []) {
        this.inputs = inputs;

        while (this.instruction !== undefined && !this.stopped) {
            this.debug(chalk`
                Instruction: {bold ${this.instruction}}
                Opcode type: {bold ${this.opcode.type}}
                Params: {bold ${this.params}}
                Inputs: {bold ${this.inputs}}
                Modes: {bold ${this.parameterModes}}
            `);

            switch (this.opcode.type) {
                case 'ADD':
                    this.add();
                    break;

                case 'MULTIPLY':
                    this.multiply();
                    break;

                case 'INPUT':
                    this.setInput();
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

                case 'ADJUST-RELATIVE-BASE':
                    this.adjustRelativeBase();
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
                    this.stopped = true;
            }

            if (this.waiting) {
                return;
            }

            this.setPointer();
            this.nextInstruction();
        }

        this.done();
    }

    getMemory() {
        return this.memory.slice(0, this.memory.indexOf(99) + 1);
    }

    getLastOutput() {
        return this.outputValues[this.outputValues.length - 1];
    }

    status() {
        if (this.stopped) {
            return 'stopped';
        }

        if (this.waiting) {
            return 'waiting';
        }
    }

    done() {
        if (this.options.done) {
            this.options.done({
                outputValues: this.outputValues,
                memory: this.memory,
            });
        }
        this.debug('Finished');
    }
}

IntcodeComputer.prototype.opcodes = {
    '01': {
        instructionLength: 4,
        paramsLength: 2,
        write: true,
        type: 'ADD',
    },
    '02': {
        instructionLength: 4,
        paramsLength: 2,
        write: true,
        type: 'MULTIPLY',
    },
    '03': {
        instructionLength: 2,
        paramsLength: 0,
        write: true,
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
        write: true,
        type: 'LESS THAN',
    },
    '08': {
        instructionLength: 4,
        paramsLength: 2,
        write: true,
        type: 'EQUALS',
    },
    '09': {
        instructionLength: 2,
        paramsLength: 1,
        type: 'ADJUST-RELATIVE-BASE',
    },
    '99': {
        instructionLength: 1,
        paramsLength: 0,
        type: 'STOP',
    },
};

IntcodeComputer.prototype.modes = {
    POSITION: 0,
    IMMEDIATE: 1,
    RELATIVE: 2,
};

module.exports = IntcodeComputer;
