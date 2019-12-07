const chalk = require('chalk');
const { MODULES, INTCODE } = require('./constants');
const day1 = require('./day1');
const day2 = require('./day2');

console.log(chalk`
    {bgGreen {black Advent of Code 2019}}

    {yellow Day 1:}
    Part 2 - Total Fuel Requirements: ${day1.run(MODULES)}

    {yellow Day 2:}
    Part 1: ${day2.test(INTCODE)}
    Part 2: ${day2.run(INTCODE)}

`);
