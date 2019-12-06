const chalk = require('chalk');
const { MODULES } = require('./constants');
const { getTotalFuelForModule } = require('./1');

const log = console.log;

// Total fuel requirements
function getTotalFuelForTrip(modules) {
    return modules.reduce(
        (acc, module) => (acc += getTotalFuelForModule(module)),
        0
    );
}

const totalFuelForTrip = getTotalFuelForTrip(MODULES);

log(chalk`
    {bgGreen {black Advent of Code 2019}}
    
    {yellow Day 1:}
    Total Fuel Requirements: ${totalFuelForTrip}
`);
