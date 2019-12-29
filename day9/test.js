const { getInput, parseIntcode } = require('../utils');
const IntcodeComputer = require('../utils/IntcodeComputer');

const input = getInput(9);
const setup = (program, ...args) =>
    new IntcodeComputer(parseIntcode(program), ...args);

describe('Sensor Boost', () => {
    it('should copy itself', () => {
        const program =
            '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
        const computer = setup(program);
        computer.run();
        expect(computer.getMemory().join(',')).toEqual(program);
    });
    it('should output 16-digit number', () => {
        const program = '1102,34915192,34915192,7,4,7,99,0';
        const computer = setup(program);
        computer.run();
        expect(computer.getLastOutput()).toEqual(1219070632396864);
    });

    it('should output large number', () => {
        const program = '104,1125899906842624,99';
        const computer = setup(program);
        computer.run();
        expect(computer.getLastOutput()).toEqual(1125899906842624);
    });

    it('should output BOOST keycode', () => {
        const computer = setup(input, {
            debugLevel: 'info',
        });
        computer.run([1]);
        expect(computer.getLastOutput()).toEqual(3497884671);
    });
});
