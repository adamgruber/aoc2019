const { getInput } = require('../utils');

const puzzleInput = getInput(12);

const puzzleInputA = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

const puzzleInputB = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;

const AXES = 3;
const NUM_STEPS = 1000;

const gcd = (a, b) => (!b ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

function lcmRange(arr) {
    // lcm(a,b,c) = lcm(lcm(a,b), c)
    return arr.reduce((acc, a, i) => {
        return lcm(a, acc);
    }, arr[0]);
}

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
    return parseInput(initialScan);
}

function simulateMovement(initialStep, numberSteps) {
    const steps = [initialStep];
    for (let i = 0; i < numberSteps; i += 1) {
        const nextStep = applyGravity(steps[i]);
        applyVelocity(nextStep);
        steps.push(nextStep);
    }
    return steps;
}

function simulateUniverse(step) {
    const nextStep = applyGravity(step);
    applyVelocity(nextStep);
    return nextStep;
}

function applyGravity(step) {
    const positions = cloneArray(step);
    const nextStep = cloneArray(step);

    let moonPos;
    let moonIdx = 0;

    while (positions.length) {
        moonPos = positions.shift();
        // Loop over positions
        for (let j = 0; j < AXES; j += 1) {
            for (let i = 0; i < positions.length; i += 1) {
                const comparePos = positions[i];
                // Loop over position values (ignoring velocities)
                const vIdx = j + AXES;
                if (moonPos[j] < comparePos[j]) {
                    nextStep[moonIdx][vIdx] += 1;
                    nextStep[moonIdx + i + 1][vIdx] -= 1;
                } else if (moonPos[j] > comparePos[j]) {
                    nextStep[moonIdx][vIdx] -= 1;
                    nextStep[moonIdx + i + 1][vIdx] += 1;
                }
            }
        }
        moonIdx += 1;
    }

    return nextStep;
}

function applyVelocity(step) {
    step.forEach(moon => {
        for (let i = 0; i < AXES; i += 1) {
            moon[i] += moon[i + AXES];
        }
    });
}

function calculateEnergy(step) {
    return step.reduce((acc, moon) => {
        let pot = 0;
        let kin = 0;
        for (let i = 0; i < AXES; i += 1) {
            pot += Math.abs(moon[i]);
            kin += Math.abs(moon[i + AXES]);
        }
        return (acc += pot * kin);
    }, 0);
}

function part1() {
    const initialStep = initSystem(puzzleInput);
    const steps = simulateMovement(initialStep, NUM_STEPS);
    const energy = calculateEnergy(steps[steps.length - 1]);
    console.log(energy);
}

function getAxis(step, axis) {
    const axes = {
        x: 0,
        y: 1,
        z: 2,
    };
    return step
        .reduce((acc, moon) => {
            acc.push(moon[axes[axis]]);
            acc.push(moon[axes[axis] + 3]);
            return acc;
        }, [])
        .join('');
}

function part2() {
    const initialStep = initSystem(puzzleInput);

    const totalSteps = [];

    ['x', 'y', 'z'].forEach(axis => {
        const axisStr = getAxis(initialStep, axis);
        let nextStep = simulateUniverse(initialStep);
        let numSteps = 1;

        while (getAxis(nextStep, axis) !== axisStr) {
            nextStep = simulateUniverse(nextStep);
            numSteps += 1;
        }

        totalSteps.push(numSteps);
    });

    const stepsToRepeat = lcmRange(totalSteps);
    console.log(stepsToRepeat);
}

part1();
part2();
