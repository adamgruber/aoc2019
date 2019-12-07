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

        console.log(args.pop(1));

        return {
            inputs: args.slice(-1).map(addr => memory[addr]),
            outputAddress: args[INSTRUCTION_LENGTH - 1],
        };
    };

    while (instruction !== undefined && instruction !== instructions.STOP) {
        // const [inputAPos, inputBPos, outputPos] = getParams();
        const { inputs, outputAddress } = getParams();
        console.log(inputs);

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

module.exports = { runIntcode };
