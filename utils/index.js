const fs = require('fs');
const path = require('path');

function getInput(day) {
    return fs.readFileSync(
        path.join(__dirname, '..', `day${day}`, 'input.txt'),
        {
            encoding: 'utf8',
        }
    );
}

function parseIntcode(raw) {
    return raw.split(',').map(parseFloat);
}

function permuteArray(arr) {
    const results = [];
    const used = [];

    function permute(inputArray) {
        for (let i = 0; i < inputArray.length; i++) {
            // Grab single element from array
            const element = inputArray.splice(i, 1)[0];

            // Add element to list of used elements
            used.push(element);

            if (inputArray.length === 0) {
                results.push(used.slice());
            }

            permute(inputArray);
            inputArray.splice(i, 0, element);

            used.pop();
        }
        return results;
    }

    return permute(arr);
}

module.exports = {
    getInput,
    permuteArray,
    parseIntcode,
};
