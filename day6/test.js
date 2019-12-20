const { getInput } = require('../utils');
const { countOrbits, getMinimumTransfers } = require('./index');

const puzzleInput = getInput(6);

const testInputA = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
`;

const testInputB = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`;

describe('Universal Orbit Map', () => {
    it('should count direct and indirect orbits for test data', () => {
        expect(countOrbits(testInputA)).toEqual(42);
    });

    it('should count direct and indirect orbits for real data', () => {
        expect(countOrbits(puzzleInput)).toEqual(271151);
    });

    it('should calc minimun number of transfers from YOU to SAN for test data', () => {
        expect(getMinimumTransfers(testInputB)).toEqual(4);
    });

    it('should calc minimun number of transfers from YOU to SAN for real data', () => {
        expect(getMinimumTransfers(puzzleInput)).toEqual(388);
    });
});
