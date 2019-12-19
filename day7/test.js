const fs = require('fs');
const path = require('path');
const IntcodeComputer = require('../utils/IntcodeComputer');
const {
    getPermutationsString,
    getPermutations,
    findMaxSignal,
} = require('./index');

const rawPuzzleInput = fs.readFileSync(path.join(__dirname, 'input.txt'), {
    encoding: 'utf8',
});

const NUM_AMPLIFIERS = 5;

const parseProgram = raw => raw.split(',').map(parseFloat);

const setup = (program, opts) => new IntcodeComputer(program, opts);

// const phaseSettings = [[3, 1, 2, 4, 0]];
const testCases = [
    {
        rawProgram: '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0',
        maxThrusterSignal: 43210,
        sequence: [4, 3, 2, 1, 0],
    },
    {
        rawProgram:
            '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0',
        maxThrusterSignal: 54321,
        sequence: [0, 1, 2, 3, 4],
    },
    {
        rawProgram:
            '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0',
        maxThrusterSignal: 65210,
        sequence: [1, 0, 4, 3, 2],
    },
];

describe('Amplification Circuit', () => {
    const runProgram = computer => computer.run();

    testCases.forEach(({ rawProgram, sequence, maxThrusterSignal }) => {
        it('should calculate max thruster signal', async () => {
            let nextInput = 0;
            for (let i = 0; i < NUM_AMPLIFIERS; i += 1) {
                const computer = setup(parseProgram(rawProgram), {
                    quiet: true,
                    inputs: [sequence[i], nextInput],
                    done({ outputValues }) {
                        nextInput = outputValues.pop();
                    },
                });
                await runProgram(computer);
            }
            expect(nextInput).toEqual(maxThrusterSignal);
        });
    });

    it('should calculate max thruster signal for puzzle input', async () => {
        const maxSignal = await findMaxSignal(rawPuzzleInput);
        expect(maxSignal).toEqual(45730);
    });
});

describe('permutations', () => {
    let values = [0, 1, 2];
    // describe('when values is a string', () => {
    //     expect(getPermutationsString(values.join(''))).toEqual();
    // });

    describe('when values is an array', () => {
        expect(getPermutations(values)).toEqual([
            [0, 1, 2],
            [0, 2, 1],
            [1, 0, 2],
            [1, 2, 0],
            [2, 0, 1],
            [2, 1, 0],
        ]);
    });
});
