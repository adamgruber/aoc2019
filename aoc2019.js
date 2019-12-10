const chalk = require('chalk');
const { MODULES, INTCODE } = require('./constants');
const day1 = require('./day1');
const day2 = require('./day2');
const day3 = require('./day3');
const inputDay3 = require('./day3/input');
const day4 = require('./day4');

console.log(chalk`
    {bgGreen {black  Advent of Code 2019 }}

    {yellow Day 1:}
    Part 2 - Total Fuel Requirements: ${day1.run(MODULES)}

    {yellow Day 2:}
    Part 1: ${day2.test(INTCODE)}
    Part 2: ${day2.run(INTCODE)}

    {yellow Day 3:}
    Part 1 - Manhattan Distance: ${
        day3.test(inputDay3.red, inputDay3.blue).distance
    }
    Part 2 - Fewest Steps to Intersection: ${
        day3.test(inputDay3.red, inputDay3.blue).steps
    }

    {yellow Day 4:}
    Number of Passwords: ${day4.run(284639, 748759)}


`);
