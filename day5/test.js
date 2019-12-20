const fs = require('fs');
const path = require('path');
const IntcodeComputer = require('../utils/IntcodeComputer');

const rawPuzzleInput = fs.readFileSync(path.join(__dirname, 'input.txt'), {
    encoding: 'utf8',
});

const parseProgram = raw => raw.split(',').map(parseFloat);

describe('Asteroids', () => {
    let computer;
    beforeEach(() => {
        computer = new IntcodeComputer(parseProgram(rawPuzzleInput));
    });

    it('should output expected diagnostic code for input 1', () => {
        computer.run([1]);
        expect(computer.getLastOutput()).toEqual(4511442);
    });

    it('should output expected diagnostic code for input 5', () => {
        computer.run([5]);
        expect(computer.getLastOutput()).toEqual(12648139);
    });
});
