const dedent = require('dedent');
const { detectAsteroids, getOptimalStation } = require('./index');
const { getInput, pointIsOnSegment } = require('../utils');

const input = getInput(10);

const testCases = [
    {
        map: dedent`
          .#..#
          .....
          #####
          ....#
          ...##
        `,
        optimalStation: {
            location: '3,4',
            asteroidsDetected: 8,
        },
    },
    {
        map: dedent`
          ......#.#.
          #..#.#....
          ..#######.
          .#.#.###..
          .#..#.....
          ..#....#.#
          #..#....#.
          .##.#..###
          ##...#..#.
          .#....####
        `,
        optimalStation: {
            location: '5,8',
            asteroidsDetected: 33,
        },
    },
    {
        map: dedent`
          #.#...#.#.
          .###....#.
          .#....#...
          ##.#.#.#.#
          ....#.#.#.
          .##..###.#
          ..#...##..
          ..##....##
          ......#...
          .####.###.
        `,
        optimalStation: {
            location: '1,2',
            asteroidsDetected: 35,
        },
    },
    {
        map: dedent`
          .#..#..###
          ####.###.#
          ....###.#.
          ..###.##.#
          ##.##.#.#.
          ....###..#
          ..#.#..#.#
          #..#.#.###
          .##...##.#
          .....#.#..
        `,
        optimalStation: {
            location: '6,3',
            asteroidsDetected: 41,
        },
    },
    {
        map: dedent`
          .#..##.###...#######
          ##.############..##.
          .#.######.########.#
          .###.#######.####.#.
          #####.##.#.##.###.##
          ..#####..#.#########
          ####################
          #.####....###.#.#.##
          ##.#################
          #####.##.###..####..
          ..######..##.#######
          ####.##.####...##..#
          .#####..#.######.###
          ##...#.##########...
          #.##########.#######
          .####.#.###.###.#.##
          ....##.##.###..#####
          .#.#.###########.###
          #.#.#.#####.####.###
          ###.##.####.##.#..##
        `,
        optimalStation: {
            location: '11,13',
            asteroidsDetected: 210,
        },
    },
];

describe('Monitoring Station', () => {
    it('should determine the number of asteroids detected for each location', () => {
        const map = dedent`
          .#..#
          .....
          #####
          ....#
          ...##
        `;
        const asteroidsMap = detectAsteroids(map);
        expect(asteroidsMap).toEqual({
            '0,2': 6,
            '1,0': 7,
            '1,2': 7,
            '2,2': 7,
            '3,2': 7,
            '3,4': 8,
            '4,0': 7,
            '4,2': 5,
            '4,3': 7,
            '4,4': 7,
        });
    });

    testCases.forEach(({ map, optimalStation }) => {
        it('should determine the optimal station', () => {
            expect(getOptimalStation(map)).toEqual(optimalStation);
        });
    });

    it('should determine the optimal station for puzzle input', () => {
        expect(getOptimalStation(input)).toEqual({
            asteroidsDetected: 247,
            location: '20,21',
        });
    });
});

// describe('pointIsOnSegment', () => {
//     xit('should work', () => {
//         const segment = [1, 0, 4, 3];
//         const points = [
//             { x: 1, y: 0 },
//             { x: 4, y: 0 },
//             { x: 0, y: 2 },
//             { x: 1, y: 2 },
//             { x: 2, y: 2 },
//             { x: 3, y: 2 },
//             { x: 4, y: 2 },
//             { x: 4, y: 3 },
//             { x: 3, y: 4 },
//             { x: 4, y: 4 },
//         ];
//         const res = points.map(point => ({
//             ...point,
//             onSegment: pointIsOnSegment(segment, point),
//         }));
//         expect(res).toEqual([]);
//     });
// });
