const cursor = require('move-terminal-cursor');
const chalk = require('chalk');

const IntcodeComputer = require('../utils/IntcodeComputer');
const { getInput } = require('../utils');

const Joystick = require('./joystick');

const input = getInput(13);

const tiles = [
    {
        name: 'EMPTY',
        char: ' ',
    },
    {
        name: 'WALL',
        char: chalk.blue('#'),
    },
    {
        name: 'BLOCK',
        char: chalk.gray('◼︎'),
    },
    {
        name: 'PADDLE',
        char: chalk.bold('━'),
    },
    {
        name: 'BALL',
        char: chalk.green.bold('◉'),
    },
];

const tileChars = tiles.map(tile => tile.char);

const NEUTRAL = 0;
const LEFT = -1;
const RIGHT = 1;

class ArcadeCabinet {
    constructor(program) {
        this.computer = new IntcodeComputer(program, {
            // debugLevel: 'info',
            done: this.finish.bind(this),
            onOutput: this.onOutput.bind(this),
        });
    }

    _drawScore() {
        cursor('toPos', { col: 1, row: 1 });
        console.log(`Score: ${this.score}`);
    }

    init() {
        this.initializing = true;

        // Initialize vars
        this.instruction = [];
        this.score = 0;
        this.gameOver = false;
        this.blocks = [];

        // Clear screen and draw board
        console.clear();
        this._drawScore();
        this.computer.run();

        this.initializing = false;
    }

    play(opts = {}) {
        // Set game to free mode
        this.computer.memory[0] = 2;

        // Set flags
        this.computer.stopped = false;

        if (opts.autoplay) {
            this.autoplay();
        } else {
            this.joystick = new Joystick({
                onKeypress: this.joystickMove.bind(this),
            });
        }
    }

    autoplay() {
        while (this.blocks.length > 0) {
            let input = NEUTRAL;
            if (this.paddleX < this.ballX) {
                input = RIGHT;
            }
            if (this.paddleX > this.ballX) {
                input = LEFT;
            }
            this.computer.run([input]);
        }

        this.gameOver = true;
    }

    getInstructions() {
        return this.computer.outputValues.slice(-3);
    }

    onOutput(val) {
        this.instruction.push(val);
        if (this.instruction.length === 3) {
            this.draw();

            // Clear the current instruction
            this.instruction = [];
        }
    }

    joystickMove(value) {
        this.computer.run([value]);
        cursor('toPos', { col: 2, row: 1 });
    }

    _isBlock(position) {
        return this.blocks.includes(position);
    }

    draw() {
        const OFFSET = 3;
        const [x, y, id] = this.instruction;
        const tile = tileChars[id];
        const col = y + OFFSET;
        const row = x + OFFSET;
        const position = `${col},${row}`;

        // Special handling for score display
        if (x === -1 && y === 0) {
            if (id === 0) {
                this.gameOver = true;
            } else {
                this.score = id;
            }
            this._drawScore();
            return;
        }

        // Special handling for initial draw of the board
        switch (id) {
            // EMPTY
            case 0:
                if (this._isBlock(position)) {
                    const idx = this.blocks.indexOf(position);
                    this.blocks.splice(idx, 1);
                }
                break;

            // BLOCK
            case 2:
                this.blocks.push(position);
                break;

            // PADDLE
            case 3:
                this.paddleX = row;
                break;

            // BALL
            case 4:
                this.ballX = row;
                break;

            default:
            // Do nothing
        }

        // Move cursor into position and draw tile
        cursor('toPos', { col, row });
        console.log(tile);
    }

    finish() {
        if (this.gameOver) {
            cursor('toPos', { col: 1, row: 1 });
            console.log(`GAME OVER: ${this.score}`);
            process.kill(process.pid, 'SIGINT');
        }
    }
}

const game = new ArcadeCabinet(input);

game.init();
game.play({ autoplay: true });
