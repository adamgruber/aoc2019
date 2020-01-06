const cursor = require('move-terminal-cursor');

const IntcodeComputer = require('../utils/IntcodeComputer');
const { getInput } = require('../utils');

const input = getInput(13);

const tiles = [
    {
        name: 'EMPTY',
        char: ' ',
    },
    {
        name: 'WALL',
        char: '#',
    },
    {
        name: 'BLOCK',
        char: '0',
    },
    {
        name: 'PADDLE',
        char: '_',
    },
    {
        name: 'BALL',
        char: '*',
    },
];

const tileChars = tiles.map(tile => tile.char);

class ArcadeCabinet {
    constructor(program) {
        this.program = program;
        this.computer = new IntcodeComputer(program, {
            // debugLevel: 'info',
            done: this.finish.bind(this),
            onOutput: this.onOutput.bind(this),
        });
        this.instruction = [];
    }

    _clearInstruction() {
        this.instruction = [];
    }

    _initTileCounts() {
        this.tileCounts = tiles.reduce(
            (acc, tile) => ({ ...acc, [tile.name]: 0 }),
            {}
        );
    }

    _countTile(tileId) {
        const tileName = tiles[tileId].name;
        this.tileCounts[tileName] += 1;
    }

    start() {
        this._initTileCounts();
        this.computer.run();
    }

    onOutput(val) {
        this.instruction.push(val);
        if (this.instruction.length === 3) {
            this.draw();
        }
    }

    draw() {
        const [x, y, id] = this.instruction;
        const tile = tileChars[id];
        cursor('toPos', { col: y + 2, row: x + 2 });
        console.log(tile);
        this._countTile(id);
        this._clearInstruction();
    }

    finish() {
        console.log('\n');
        console.log(this.tileCounts);
    }
}

const game = new ArcadeCabinet(input);

game.start();
