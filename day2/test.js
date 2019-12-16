const IntcodeComputer = require('../utils/IntcodeComputer');

const testIntcodes = [
    { program: [1, 0, 0, 0, 99], output: [2, 0, 0, 0, 99] },
    { program: [2, 3, 0, 3, 99], output: [2, 3, 0, 6, 99] },
    { program: [2, 4, 4, 5, 99, 0], output: [2, 4, 4, 5, 99, 9801] },
    {
        program: [1, 1, 1, 4, 99, 5, 6, 0, 99],
        output: [30, 1, 1, 4, 2, 5, 6, 0, 99],
    },
];

const setup = program => new IntcodeComputer(program);

describe('getFuelForModule', () => {
    testIntcodes.forEach(({ program, output }) => {
        it('should return expected output', () => {
            const computer = setup(program);
            computer
                .run()
                .then(final => {
                    expect(final).toEqual(output);
                })
                .catch(err => console.log(err));
        });
    });
});
