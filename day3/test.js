const { test: testRun } = require('./index');

const testCases = [
    { red: 'R8,U5,L5,D3', blue: 'U7,R6,D4,L4', distance: 6, steps: 30 },
    {
        red: 'R75,D30,R83,U83,L12,D49,R71,U7,L72',
        blue: 'U62,R66,U55,R34,D71,R55,D58,R83',
        distance: 159,
        steps: 610,
    },
    {
        red: 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
        blue: 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7',
        distance: 135,
        steps: 410,
    },
];

describe('Crossed Wires', () => {
    testCases.forEach(({ red, blue, distance, steps }) => {
        it('should return expected distance', () => {
            expect(testRun(red, blue)).toEqual({ distance, steps });
        });
    });
});
