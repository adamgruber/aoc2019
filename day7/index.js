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

function runSequence(sequence, program, options = {}) {
    let nextInput = 0;
    for (let i = 0; i < NUM_AMPLIFIERS; i += 1) {
        const computer = setup(program, {
            done({ outputValues }) {
                nextInput = outputValues.pop();
            },
            ...options,
        });
        computer.run([sequence[i], nextInput]);
    }
    return nextInput;
}

function runSequenceLoop(sequence, program, options = {}) {
    // Create the amplifiers
    const amps = Array(NUM_AMPLIFIERS)
        .fill(0)
        .map(() => setup(program));

    let ampIndex = 0;
    let nextInput = 0;

    // While the last amplifier is still running
    while (amps[NUM_AMPLIFIERS - 1].status() !== 'stopped') {
        const amp = amps[ampIndex];

        // On first run, send the phase setting and input
        if (!amp.status()) {
            amp.run([sequence[ampIndex], nextInput]);

            // Otherwise just send the previous amplifier output as input
        } else {
            amp.run([nextInput]);
        }

        // Set next input
        nextInput = amp.getLastOutput();

        // If we've reached the last amplifier, loop back to first
        if (ampIndex === NUM_AMPLIFIERS - 1) {
            ampIndex = 0;
        } else {
            ampIndex += 1;
        }
    }

    return nextInput;
}

function findMaxSignal(input, phaseSettings, options = {}) {
    const sequences = getPermutations(phaseSettings);
    const signals = [];

    for (let i = 0; i < sequences.length; i += 1) {
        const sequence = sequences[i];
        const signal = options.loop
            ? runSequenceLoop(sequence, parseProgram(input))
            : runSequence(sequence, parseProgram(input), {
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
