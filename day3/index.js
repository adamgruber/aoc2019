// Parse raw string path
function parsePath(path) {
    return path.split(',').map(segment => {
        const direction = segment.slice(0, 1);
        const steps = parseInt(segment.substr(1, segment.length), 10);
        return { direction, steps };
    });
}

/**
 * Given a starting point and an array of points (x,y),
 * determine the point that is closest to the start
 */
function closestPoint(start, points) {
    let distance;
    let closest;
    points.forEach(point => {
        const dist = Math.abs(point.x - start.x) + Math.abs(point.y - start.y);
        if (!distance || dist < distance) {
            distance = dist;
            closest = point;
        }
    });
    return closest;
}

function isSamePlane(start, end, val) {
    return start === end && end === val;
}

function isBetween(start, end, val) {
    return start > val && val < end;
}

function pointIsOnSegment(aX, aY, bX, bY, x, y) {
    return (
        (isSamePlane(aX, bX, x) && isBetween(aY, bY, y)) ||
        (isSamePlane(aY, bY, y) && isBetween(aX, bX, x))
    );
}

function getStepsToPoint(pathPoints, endPoint) {
    let steps = 0;
    const { x, y } = endPoint;
    const path = [{ x: 0, y: 0 }, ...pathPoints];
    for (let i = 0; i < path.length - 1; i += 1) {
        const aX = path[i].x;
        const aY = path[i].y;
        const bX = path[i + 1].x;
        const bY = path[i + 1].y;

        console.log(aX, aY, bX, bY, x, y);
        let addSteps;

        if (pointIsOnSegment(aX, aY, bX, bY, x, y)) {
            if (aX === bX) {
                addSteps = Math.abs(bY - y);
            } else {
                addSteps = Math.abs(bX - x);
            }
            console.log('add ', addSteps);
            steps += addSteps;
            break;
        } else {
            if (aX === bX) {
                addSteps = Math.abs(bY - aY);
            } else {
                addSteps = Math.abs(bX - aX);
            }
            console.log('add ', addSteps);
            steps += addSteps;
        }
        console.log('total', steps);
    }
    return steps;
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// http://paulbourke.net/geometry/pointlineplane/javascript.txt
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }

    denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return { x, y };
}

function walkPath(path) {
    const instructionRegex = /^([R|U|D|L])([0-9]+)$/;
    const instructions = path.trim().split(',');
    const point = { x: 0, y: 0 };
    const points = [];
    const segments = [];

    const moveRight = steps => {
        point.x += parseInt(steps, 10);
    };

    const moveLeft = steps => {
        point.x -= parseInt(steps, 10);
    };

    const moveUp = steps => {
        point.y += parseInt(steps, 10);
    };

    const moveDown = steps => {
        point.y -= parseInt(steps, 10);
    };

    const recordPoint = () => {
        points.push({ ...point });
    };

    instructions.forEach((instruction, index) => {
        const [_, direction, steps] = instruction.match(instructionRegex);
        switch (direction) {
            case 'R':
                moveRight(steps);
                break;

            case 'U':
                moveUp(steps);
                break;

            case 'L':
                moveLeft(steps);
                break;

            case 'D':
                moveDown(steps);
                break;

            default:
            // Unexpected
        }

        recordPoint();
    });

    return points;
}

/**
 * @param {string} red Path of red wire
 * @param {string} blue Path of blue wire
 * @return {number} Manhattan distance intersection point closest to terminal
 */
function test(red, blue) {
    const start = { x: 0, y: 0 };
    const redPoints = walkPath(red);
    const bluePoints = walkPath(blue);

    const intersections = [];

    for (let i = 0; i < redPoints.length - 1; i += 1) {
        for (let j = 0; j < bluePoints.length - 1; j += 1) {
            const A = redPoints[i];
            const B = redPoints[i + 1];
            const C = bluePoints[j];
            const D = bluePoints[j + 1];
            const intersection = intersect(
                A.x,
                A.y,
                B.x,
                B.y,
                C.x,
                C.y,
                D.x,
                D.y
            );
            if (intersection) {
                intersections.push(intersection);
            }
        }
    }

    const closest = closestPoint(start, intersections);

    // Calculate steps to each intersection for each wire
    const steps = intersections.map(
        intersection => getStepsToPoint(redPoints, intersection)
        // getStepsToPoint(bluePoints, intersection)
    );

    console.log(steps);

    return { distance: closest.x + closest.y, steps: Math.min(...steps) };
}

module.exports = { test };
