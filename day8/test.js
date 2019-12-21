const { getInput } = require('../utils');
const input = getInput(8);
const {
    splitToLayers,
    getDigitCount,
    getDigitCountByLayer,
} = require('./index');

const imageSize = [25, 6];

describe('Space Image Format', () => {
    it('should split input into layers', () => {
        expect(splitToLayers(input, ...imageSize).length).toEqual(100);
    });

    it('find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits', () => {
        const layers = splitToLayers(input, ...imageSize);
        const counts = getDigitCountByLayer(layers, 0);
        const fewestZeroes = Math.min(...counts);
        const fewestZeroesLayer = layers[counts.indexOf(fewestZeroes)];
        const ones = getDigitCount(fewestZeroesLayer, 1);
        const twos = getDigitCount(fewestZeroesLayer, 2);
        expect(ones * twos).toEqual(1215);
    });
});
