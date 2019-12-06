function runIntcode(program) {
    const opcodes = {
        ADD: 1,
        MULTIPLY: 2,
        STOP: 99,
    };
    let currentPosition = 0;
    let opcode = program[currentPosition];

    const getPositions = () => [
        program[currentPosition + 1],
        program[currentPosition + 2],
        program[currentPosition + 3],
    ];

    while (opcode !== undefined && opcode !== opcodes.STOP) {
        const [inputAPos, inputBPos, outputPos] = getPositions();
        const inputA = program[inputAPos];
        const inputB = program[inputBPos];

        switch (program[currentPosition]) {
            case opcodes.ADD:
                program[outputPos] = inputA + inputB;
                break;

            case opcodes.MULTIPLY:
                program[outputPos] = inputA * inputB;
                break;

            default:
            // Unexpected
        }

        currentPosition += 4;
        opcode = program[currentPosition];
    }

    return program;
}

module.exports = { runIntcode };
