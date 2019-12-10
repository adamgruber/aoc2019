const { isValidPassword } = require('./index');

const testCases = [
    [223450, false],
    [123789, false],
    [112233, true],
    [123444, false],
    [111122, true],
];

describe('Secure Container', () => {
    testCases.forEach(([password, isValid]) => {
        it(`should validate password: ${password}`, () => {
            expect(isValidPassword(password)).toEqual(isValid);
        });
    });
});
