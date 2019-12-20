const IntcodeComputer = require('../utils/IntcodeComputer');

const comp = new IntcodeComputer([3, 0, 4, 0], { debug: true, inputs: [10] });
comp.run();
