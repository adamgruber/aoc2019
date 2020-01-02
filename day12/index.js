const { getInput } = require('../utils');

const puzzleInput = getInput(12);

function parseInput(input) {
    return input.split('\n').reduce((acc, moonPosition) => {
        const [_, x, y, z] = moonPosition
            .match(/x=([^,]+), y=([^,]+), z=([^>]+)/)
            .map(parseFloat);
        acc.push([x, y, z, 0, 0, 0]);
        return acc;
    }, []);
}

function cloneArray(arr) {
    return arr.map(innerArr => [...innerArr]);
}

function initSystem(initialScan) {
    const steps = parseInput(initialScan);

    // applyGravity(steps[0].positions, steps[0].velocities);

    console.log(steps);

    // for (let i = 0; i < 10; i += 1) {
    //     const { positions, velocities } = steps[i];
    // }
}

function applyGravity(step) {
    const velocityAdjustments = [0, 0, 0];
    const nextStep = cloneArray(step);

    let moonPos = clonedPositions.shift();

    while (clonedPositions.length) {
        for (let i = 0; i < clonedPositions.length; i += 1) {
            const comparePos = clonedPositions[i];

            // Calc adjustment velocity for moon and comparator
            if (comparePos > moonPos) {
                velocityAdjustments[i] += 1;
                velocityAdjustments[i + 1] -= 1;
            } else {
                velocityAdjustments[i] -= 1;
                velocityAdjustments[i + 1] += 1;
            }
        }
        moonPos = clonedPositions.shift();
    }

    clonedVelocities.forEach((vel, i) => (vel += velocityAdjustments[i]));
}

initSystem(puzzleInput);
