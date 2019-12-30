const {
    pointIsOnSegment,
    getEquationOfLineFromTwoPoints,
} = require('../utils');

/**
 * Parse a map into an array of points where there are asteroids
 *
 * @param {string} map Raw map input
 *
 * @return {array}
 */
function parseMap(map) {
    const ASTEROID = '#';
    const asteroids = [];
    const rows = map.split('\n').forEach((row, y) => {
        row = row.split('');
        row.forEach((char, x) => {
            if (char === ASTEROID) {
                asteroids.push({ x, y });
            }
        });
    });

    return asteroids;
}

function detectAsteroids(map) {
    const asteroids = parseMap(map);

    const asteroidsMap = {};

    asteroids.forEach(station => {
        for (let i = 0; i < asteroids.length; i += 1) {
            const asteroid = asteroids[i];

            // Don't compare same station
            if (asteroid === station) {
                continue;
            }

            const stationName = `${station.x},${station.y}`;
            const segment = [station.x, station.y, asteroid.x, asteroid.y];

            if (!asteroidsMap[stationName]) {
                asteroidsMap[stationName] = 0;
            }

            // So long as no other asteroid is on the segment between station
            // and asteroid, increment the count
            const roidsOnSegment = asteroids
                .map(roid => pointIsOnSegment(segment, roid))
                .filter(x => x);

            if (!roidsOnSegment.length) {
                asteroidsMap[stationName] += 1;
            }
        }
    });

    return asteroidsMap;
}

function getOptimalStation(map) {
    const asteroidsMap = detectAsteroids(map);
    // console.log(asteroidsMap);
    let optimalStation;
    let maxCount = 0;
    Object.entries(asteroidsMap).forEach(([station, count]) => {
        if (count > maxCount) {
            optimalStation = station;
            maxCount = count;
        }
    });

    return {
        location: optimalStation,
        asteroidsDetected: maxCount,
    };
}

module.exports = {
    detectAsteroids,
    getOptimalStation,
};
