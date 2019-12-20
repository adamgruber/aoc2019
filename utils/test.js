const { permuteArray } = require('./index');

describe('permuteArray', () => {
    let values = [0, 1, 2];
    it('should calculate permutations', () => {
        expect(permuteArray(values)).toEqual([
            [0, 1, 2],
            [0, 2, 1],
            [1, 0, 2],
            [1, 2, 0],
            [2, 0, 1],
            [2, 1, 0],
        ]);
    });
});
