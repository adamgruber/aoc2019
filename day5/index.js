const program = require('./program');
const IntcodeComputer = require('../utils/IntcodeComputer');

const computer = new IntcodeComputer(program);
computer
    .run()
    .then(() => {
        process.exit();
    })
    .catch(err => console.log(err));
