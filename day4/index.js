/**
 * Validate password against following rules:
 * - six digits
 * - at least 2 adjacent digits are the same
 *   and not part of a larger group of repeats
 * - digits never decrease from left to right
 */
function isValidPassword(num) {
    const numString = num.toString();

    // Check length is correct
    if (numString.length !== 6) {
        return false;
    }

    let hasDoubleDigits = false;
    let hasOnlyIncreasingDigits = true;

    // Check for adjacent pairs
    const groups = numString.match(/(\d)\1+/g) || [];
    for (let i = 0; i < groups.length; i += 1) {
        if (groups[i].length === 2) {
            hasDoubleDigits = true;
            break;
        }
    }

    for (let i = 0; i < numString.length; i += 1) {
        const current = numString[i];
        const next = numString[i + 1];

        if (next < current) {
            hasOnlyIncreasingDigits = false;
            break;
        }
    }

    return hasDoubleDigits && hasOnlyIncreasingDigits;
}

function run(start, end) {
    let passwords = [];

    for (let i = start; i <= end; i += 1) {
        if (isValidPassword(i)) {
            passwords.push(i);
        }
    }

    return passwords.length;
}

module.exports = { isValidPassword, run };
