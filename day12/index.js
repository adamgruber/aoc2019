const { getInput } = require('../utils');

// const puzzleInput = getInput(12);
const puzzleInput = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

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
    const steps = [parseInput(initialScan)];

    // applyGravity(steps[0].positions, steps[0].velocities);
    // console.log(steps);

    for (let i = 0; i < 1; i += 1) {
        steps.push(applyGravity(steps[i]));
    }

    console.log(steps[0]);
    console.log('\n');
    console.log(steps[1]);
}

function applyGravity(step) {
    console.log('applyGravity');
    const positions = cloneArray(step);
    const nextStep = cloneArray(step);

    let moonPos;
    let moonIdx = 0;

    while (positions.length) {
        moonPos = positions.shift();
        // console.log(nextStep[moonIdx], 'adam');
        // Loop over positions
        for (let j = 0; j < 3; j += 1) {
            console.log('\n');
            for (let i = 0; i < positions.length; i += 1) {
                const comparePos = positions[i];
                // Loop over position values (ignoring velocities)
                const vIdx = j + 3;
                // const moonVelocity = nextStep[moonIdx][vIdx];
                // Calc adjustment velocity for moon and comparator
                // console.log(`
                //   moonIdx: ${moonIdx}
                //   velocityIndex: ${vIdx}
                //   moonPos: ${moonPos[j]}
                //   comparePos: ${comparePos[j]}
                //   moonVelocity: ${nextStep[moonIdx][vIdx]}
                // `);
                // let nextVelocity;
                console.log('moon index:', moonIdx, i, j);
                if (moonPos[j] < comparePos[j]) {
                    console.log(moonPos[j], comparePos[j], 1);
                    // console.log(`adding velocity to moon ${moonIdx}`);
                    // console.log(
                    //     `subtracting velocity from moon ${moonIdx + 1}`
                    // );
                    nextStep[moonIdx][vIdx] += 1;
                    nextStep[moonIdx + 1][vIdx] -= 1;
                    // nextVelocity = moonVelocity + 1;
                    // console.log(nextVelocity);
                } else if (moonPos[j] > comparePos[j]) {
                    console.log(moonPos[j], comparePos[j], -1);
                    // console.log(`adding velocity to moon ${moonIdx + 1}`);
                    // console.log(`subtracting velocity from moon ${moonIdx}`);
                    // nextVelocity = moonVelocity - 1;
                    nextStep[moonIdx][vIdx] -= 1;
                    nextStep[moonIdx + 1][vIdx] += 1;
                } else {
                    console.log(moonPos[j], comparePos[j], 0);
                }
            }
        }
        moonIdx += 1;
    }

    return nextStep;
}

initSystem(puzzleInput);
