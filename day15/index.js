const cursor = require('move-terminal-cursor');
const chalk = require('chalk');

const IntcodeComputer = require('../utils/IntcodeComputer');
const { getInput } = require('../utils');

const input = getInput(15);

const tiles = {
    DROID: chalk.green.bold('◉'),
    WALL: chalk.blue('#'),
    HALL: chalk.grey('-'),
};

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

const directions = {
    NORTH: 1,
    SOUTH: 2,
    WEST: 3,
    EAST: 4,
};

const dirNames = Object.keys(directions);
dirNames.unshift('');
const dirs = Object.values(directions);

class RepairDroid {
    constructor(program) {
        this.computer = new IntcodeComputer(program, {
            // debugLevel: 'info',
            done: this.finish.bind(this),
            onOutput: this.onOutput.bind(this),
        });
    }

    init() {
        // Initialize vars
        this.instruction = [];
        this.position = [40, 20];
        // this.direction = NORTH;
        this.positions = {};
        this.foundOxygenSystem = false;

        console.clear();
        this.draw(this.position, 'DROID');
    }

    move(direction) {
        this.direction = direction;
        // console.log(`
        //   Current position: ${this.position}
        //   Moving: ${dirNames[direction]}
        // `);
        this.computer.run([direction]);
    }

    getNextDirection() {
        const curr = dirs.indexOf(this.direction);
        let next = (this.direction % dirs.length) + 1;
        let nextPos = this._getNextPosition(this.position, next);
        // console.log(`
        //   getNextDirection
        //   currentDir: ${this.direction}
        //   nextDir: ${next}
        // `);

        // while (this.isWall(nextPos)) {
        //     next += 1;
        //     nextPos = this._getNextPosition(this.position, next);
        // }

        return next;
    }

    _drawStatus(status) {
        cursor('toPos', { col: 1, row: 1 });
        console.log(status);
    }

    onOutput(val) {
        const direction = this.direction;
        this.direction = null;

        switch (val) {
            case 2:
                console.log('found oxygen system');
                this.foundOxygenSystem = true;
                break;

            case 1:
                this.onMoved(direction);
                break;

            case 0:
                this.onHitWall(direction);
                // this.direction = this.getNextDirection();
                // this.move();
                break;

            default:
            // Unexpected
        }

        // this.direction = this.getNextDirection();

        // console.log(this.direction);

        // this.move(this.direction);
    }

    onMoved(direction) {
        this._drawStatus('MOVED');
        this.draw(this.position, 'HALL');
        const nextPosition = this._getNextPosition(this.position, direction);
        this.draw(nextPosition, 'DROID');
    }

    onHitWall(direction) {
        this._drawStatus('HIT WALL');
        const position = this._getNextPosition(this.position, direction);
        this.draw(position, 'WALL');
    }

    isWall(position) {
        return this.positions[position] === 'WALL';
    }

    isVisited(position) {
        return !!this.positions[posiiton];
    }

    _getNextPosition(current, moveDirection) {
        let [x, y] = current;
        switch (moveDirection) {
            case NORTH:
                y -= 1;
                break;

            case SOUTH:
                y += 1;
                break;

            case WEST:
                x -= 1;
                break;

            case EAST:
                x += 1;
                break;

            default:
            // Unexpected
        }
        return [x, y];
    }

    draw(pos, tileName) {
        const OFFSET = 3;
        const [x, y] = pos;
        const col = y + OFFSET;
        const row = x + OFFSET;
        const position = `${col},${row}`;

        // Record position
        if (!this.positions[`${x},${y}`]) {
            this.positions[`${x},${y}`] = tileName;
        }

        // Move cursor into position and draw tile
        cursor('toPos', { col, row });
        console.log(tiles[tileName]);
    }

    finish() {
        console.log(this.positions);
    }
}

const droid = new RepairDroid(input);

droid.init();
droid.move(NORTH);
droid.move(SOUTH);
droid.move(WEST);
droid.move(EAST);
