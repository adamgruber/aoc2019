const cursor = require('move-terminal-cursor');

const IntcodeComputer = require('../utils/IntcodeComputer');
const { getInput } = require('../utils');

const input = getInput(11);

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const directions = [UP, RIGHT, DOWN, LEFT];

class HullPaintingRobot {
    constructor(program) {
        this.program = program;
        this.computer = new IntcodeComputer(program, {
            // debugLevel: 'info',
            done: this.finish.bind(this),
        });
        this.position = [0, 0];
        this.facing = UP;
        this.panels = {};
        this.panelsPainted = 0;
    }

    start() {
        this.computer.run([1]);
        while (this.computer.status() !== 'stopped') {
            const [color, direction] = this.getInstructions();
            this.paintPanel(color);
            this.move(direction);
            this.computer.run([this.getInput()]);
        }
    }

    // Get input instruction for IntcodeComputer
    // If current position panel is black, return 0
    // If current position panel is white, return 1
    getInput() {
        const pos = this.position.join(',');
        if (this.panels[pos] === undefined) {
            return 0;
        }

        return this.panels[pos];
    }

    getInstructions() {
        return this.computer.outputValues.slice(-2);
    }

    paintPanel(color) {
        const pos = this.position.join(',');
        // console.log(`painting: ${pos}, ${color}`);
        if (this.panels[pos] === undefined) {
            this.panelsPainted += 1;
        }
        this.panels[pos] = color;
    }

    move(direction) {
        if (direction === 0) {
            this._turnLeft();
        }

        if (direction === 1) {
            this._turnRight();
        }

        this._move();
    }

    _turnLeft() {
        if (this.facing === UP) {
            this.facing = LEFT;
        } else {
            this.facing = directions[directions.indexOf(this.facing) - 1];
        }
    }

    _turnRight() {
        if (this.facing === LEFT) {
            this.facing = UP;
        } else {
            this.facing = directions[directions.indexOf(this.facing) + 1];
        }
    }

    _move() {
        // Get current position
        const [x, y] = this.position;

        switch (this.facing) {
            case UP:
                this.position = [x, y + 1];
                break;

            case RIGHT:
                this.position = [x + 1, y];
                break;

            case DOWN:
                this.position = [x, y - 1];
                break;

            case LEFT:
                this.position = [x - 1, y];
                break;

            default:
            // Unexpected
        }
    }

    draw() {
        const values = Object.keys(this.panels).forEach(location => {
            const color = this.panels[location];
            const [x, y] = location.split(',').map(parseFloat);
            cursor('toPos', { col: Math.abs(y) + 3, row: x + 1 });
            if (color === 0) {
                console.log(' ');
            } else {
                console.log('0');
            }
            console.log('\n');
        });
    }

    finish() {
        this.draw();
    }
}

const robot = new HullPaintingRobot(input);

robot.start();
