const IntcodeComputer = require('../utils/IntcodeComputer');

function getPermutationsString(values) {
    const valuesString = values;
    const permutations = [];

    if (valuesString.length === 1) {
        permutations.push(valuesString);
        return permutations;
    }

    for (let i = 0; i < valuesString.length; i += 1) {
        const firstVal = valuesString[i];
        const rest =
            valuesString.substring(0, i) + valuesString.substring(i + 1);
        const innerPermutations = getPermutationsString(rest);
        for (let j = 0; j < innerPermutations.length; j += 1) {
            permutations.push(firstVal + innerPermutations[j]);
        }
    }

    return permutations;
}

function getPermutations(arr) {
    const results = [];
    const used = [];

    function permute(inputArray) {
        for (let i = 0; i < inputArray.length; i++) {
            // Grab single element from array
            const element = inputArray.splice(i, 1)[0];

            // Add element to list of used elements
            used.push(element);

            if (inputArray.length === 0) {
                results.push(used.slice());
            }

            permute(inputArray);
            inputArray.splice(i, 0, element);

            used.pop();
        }
        return results;
    }

    return permute(arr);
}

const NUM_AMPLIFIERS = 5;
const setup = (...args) => new IntcodeComputer(...args);
const parseProgram = raw => raw.split(',').map(parseFloat);
const runProgram = computer => computer.run();

async function runSequence(sequence, program, options = {}) {
    let nextInput = 0;
    for (let i = 0; i < NUM_AMPLIFIERS; i += 1) {
        const computer = setup(program, {
            inputs: [sequence[i], nextInput],
            done({ outputValues }) {
                nextInput = outputValues.pop();
            },
            ...options,
        });
        await runProgram(computer);
    }
    return nextInput;
}

async function findMaxSignal(input) {
    const sequences = getPermutations([0, 1, 2, 3, 4]);
    const signals = [];

    for (let i = 0; i < sequences.length; i += 1) {
        const sequence = sequences[i];
        const signal = await runSequence(sequence, parseProgram(input), {
            quiet: true,
        });
        signals.push(signal);
    }

    return Math.max(...signals);
}

module.exports = {
    getPermutationsString,
    getPermutations,
    findMaxSignal,
};
