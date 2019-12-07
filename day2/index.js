const INSTRUCTION_LENGTH = 4;

function runIntcode(memory) {
    const instructions = {
        ADD: 1,
        MULTIPLY: 2,
        STOP: 99,
    };
    let pointer = 0;
    let instruction = memory[pointer];

    const getParams = () => {
        const args = Array(INSTRUCTION_LENGTH - 1)
            .fill(0)
            .map((_, i) => memory[pointer + i + 1]);

        const outputAddress = args.pop();

        return {
            inputs: args.map(addr => memory[addr]),
            outputAddress,
        };
    };

    while (instruction !== undefined && instruction !== instructions.STOP) {
        const { inputs, outputAddress } = getParams();

        switch (memory[pointer]) {
            case instructions.ADD:
                memory[outputAddress] = inputs[0] + inputs[1];
                break;

            case instructions.MULTIPLY:
                memory[outputAddress] = inputs[0] * inputs[1];
                break;

            default:
            // Unexpected
        }

        pointer += INSTRUCTION_LENGTH;
        instruction = memory[pointer];
    }

    return memory;
}

// Day 2
function fixGravityAssist(initialMemory, noun, verb) {
    const memory = [...initialMemory];
    memory[1] = noun;
    memory[2] = verb;

    return runIntcode(memory)[0];
}

// Day 2.2
function run(initialMemory) {
    let noun;
    let verb;
    for (let n = 0; n < 100; n += 1) {
        for (let v = 0; v < 100; v += 1) {
            if (fixGravityAssist(initialMemory, n, v) === 19690720) {
                noun = n;
                verb = v;
                break;
            }
        }
    }

    return 100 * noun + verb;
}

module.exports = {
    runIntcode,
    run,
    test: initialMemory => fixGravityAssist(initialMemory, 12, 2),
};
