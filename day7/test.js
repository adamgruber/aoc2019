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

const loopTests = [
    {
        rawProgram:
            '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5',
        maxThrusterSignal: 139629729,
        sequence: [9, 8, 7, 6, 5],
    },
    {
        rawProgram:
            '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10',
        maxThrusterSignal: 18216,
        sequence: [9, 8, 7, 6, 5],
    },
];

describe('Amplification Circuit', () => {
    testCases.forEach(({ rawProgram, sequence, maxThrusterSignal }) => {
        it('should calculate max thruster signal', () => {
            const maxSignal = findMaxSignal(rawProgram, [0, 1, 2, 3, 4]);
            expect(maxSignal).toEqual(maxThrusterSignal);
        });
    });

    it('should calculate max thruster signal for puzzle input', () => {
        const maxSignal = findMaxSignal(rawPuzzleInput, [0, 1, 2, 3, 4]);
        expect(maxSignal).toEqual(45730);
    });

    loopTests.forEach(({ rawProgram, sequence, maxThrusterSignal }) => {
        it('should calculate max thruster signal', () => {
            const maxSignal = findMaxSignal(rawProgram, [5, 6, 7, 8, 9], {
                loop: true,
            });
            expect(maxSignal).toEqual(maxThrusterSignal);
        });
    });

    it('should calculate max thruster signal for puzzle input part 2', () => {
        const maxSignal = findMaxSignal(rawPuzzleInput, [5, 6, 7, 8, 9], {
            loop: true,
        });
        expect(maxSignal).toEqual(5406484);
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
