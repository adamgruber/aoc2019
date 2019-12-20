const { getInput, parseIntcode } = require('../utils');
const IntcodeComputer = require('../utils/IntcodeComputer');

const rawPuzzleInput = getInput(5);

describe('Asteroids', () => {
    let computer;
    beforeEach(() => {
        computer = new IntcodeComputer(parseIntcode(rawPuzzleInput));
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
