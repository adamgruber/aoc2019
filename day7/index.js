const { permuteArray, parseIntcode } = require('../utils');
const IntcodeComputer = require('../utils/IntcodeComputer');

const NUM_AMPLIFIERS = 5;
const setup = (...args) => new IntcodeComputer(...args);

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
    const sequences = permuteArray(phaseSettings);
    const signals = [];

    for (let i = 0; i < sequences.length; i += 1) {
        const sequence = sequences[i];
        const signal = options.loop
            ? runSequenceLoop(sequence, parseIntcode(input))
            : runSequence(sequence, parseIntcode(input), {
                  quiet: true,
              });

        signals.push(signal);
    }

    return Math.max(...signals);
}

module.exports = {
    findMaxSignal,
};
