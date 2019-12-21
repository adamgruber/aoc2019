function splitToLayers(input, width, height) {
    const layers = [];
    const arr = input.split('');
    while (arr.length) {
        layers.push(arr.splice(0, width * height).join(''));
    }
    return layers;
}

function getDigitCount(layer, digit) {
    const matcher = new RegExp(digit, 'g');
    return (layer.match(matcher) || []).length;
}

function getDigitCountByLayer(layers, digit) {
    return layers.map(layer => getDigitCount(layer, digit));
}

module.exports = {
    splitToLayers,
    getDigitCount,
    getDigitCountByLayer,
};
