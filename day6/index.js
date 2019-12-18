const convertInputToMap = input => {
    const stations = {};
    const allNodes = input
        .trim()
        .split('\n')
        .map(orbit => {
            const [station, orbiter] = orbit.split(')');
            if (!stations[stations]) {
                stations[station] = [];
            }

            if (!stations[orbiter]) {
                stations[orbiter] = [];
            }

            return [station, orbiter];
        });

    allNodes.forEach(([station, orbiter]) => {
        stations[station].push(orbiter);
    });

    return stations;
};

const countOrbits = input => {
    let orbits = 0;
    const map = convertInputToMap(input);

    const countOrbiters = stationName => {
        const orbiters = map[stationName];
        orbits += orbiters.length;
        orbiters.forEach(orbiterName => {
            countOrbiters(orbiterName);
        });
    };

    Object.keys(map).forEach(stationName => {
        countOrbiters(stationName);
    });

    return orbits;
};

const findParents = (stations, child, parents = []) => {
    Object.keys(stations).forEach(station => {
        if (stations[station].includes(child)) {
            parents.push(station);
            findParents(stations, station, parents);
        }
    });
    return parents;
};

const getMinimumTransfers = input => {
    const map = convertInputToMap(input);
    const youParents = findParents(map, 'YOU');
    const sanParents = findParents(map, 'SAN');
    let transfers = 0;
    let matchIndex;

    for (let i = 0; i < youParents.length; i += 1) {
        const youParent = youParents[i];
        const youParentIndex = sanParents.indexOf(youParent);
        if (youParentIndex > 0) {
            matchIndex = youParentIndex;
            break;
        }
        transfers += 1;
    }

    return transfers + matchIndex;
};

module.exports = { countOrbits, getMinimumTransfers };
