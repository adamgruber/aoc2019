const chalk = require('chalk');

/**
 * Split raw image input into layers based on image dimensions
 *
 * @param {string} input Puzzle input
 * @param {number} width Image pixel width
 * @param {number} height Image pixel height
 * @return {array}
 */
function splitToLayers(input, width, height) {
    const layers = [];
    const layerSize = width * height;
    const numLayers = input.length / layerSize;

    for (let i = 0; i < numLayers; i += 1) {
        const start = layerSize * i;
        const end = layerSize * (i + 1);
        layers.push(input.slice(start, end));
    }

    return layers;
}

/**
 * Given layer data, return the number of times
 * the given digit appears in the data
 *
 * @param {string} layer Layer data
 * @param {number} digit Digit to count
 * @return {number}
 */
function getDigitCount(layer, digit) {
    const matcher = new RegExp(digit, 'g');
    return (layer.match(matcher) || []).length;
}

/**
 * Given an array of layers, return an array of the number of times
 * the given digit appears in each layer
 *
 * @param {string[]} layers Array of layer data
 * @param {number} digit Digit to count
 * @return {number[]}
 */
function getDigitCountByLayer(layers, digit) {
    return layers.map(layer => getDigitCount(layer, digit));
}

function splitLayer(layer, height) {
    const layers = [];
    const numLayers = layer.length / height;

    for (let i = 0; i < numLayers; i += 1) {
        const start = height * i;
        const end = height * (i + 1);
        layers.push(layer.slice(start, end));
    }

    return layers.join('\n');
}

function decodeImage(data, dimensions) {
    let layers = splitToLayers(data, ...dimensions);

    const BLACK = '0';
    const WHITE = '1';

    const width = dimensions[0];
    const height = dimensions[1];

    let pixels = '';

    for (let i = 0; i < width * height; i += 1) {
        for (let j = 0; j < layers.length; j += 1) {
            const layer = layers[j];
            const pixel = layer[i];

            if (pixel === BLACK) {
                pixels += ' ';
                break;
            }

            if (pixel === WHITE) {
                pixels += BLACK;
                break;
            }
        }
    }

    const image = splitLayer(pixels, width);
    console.log(image);
}

module.exports = {
    splitToLayers,
    getDigitCount,
    getDigitCountByLayer,
    decodeImage,
};
