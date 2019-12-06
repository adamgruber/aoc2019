const chalk = require('chalk');
const { MODULES, INTCODE } = require('./constants');
const { getTotalFuelForModule } = require('./day1');
const { runIntcode } = require('./day2');

const log = console.log;

// Day 1: Total fuel requirements
function getTotalFuelForTrip(modules) {
    return modules.reduce(
        (acc, module) => (acc += getTotalFuelForModule(module)),
        0
    );
}

const totalFuelForTrip = getTotalFuelForTrip(MODULES);

// Day 2: Intcode
function restoreGravityAssist() {
    const program = [...INTCODE];
    program[1] = 12;
    program[2] = 2;

    return runIntcode(program)[0];
}

const gravityAssist = restoreGravityAssist(INTCODE);

log(chalk`
    {bgGreen {black Advent of Code 2019}}

    {yellow Day 1:}
    Total Fuel Requirements: ${totalFuelForTrip}

    {yellow Day 2:}
    1202 program alarm halt position 0 value: ${gravityAssist}
`);
