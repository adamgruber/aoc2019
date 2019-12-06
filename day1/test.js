const { getFuelForModule, getTotalFuelForModule } = require('./index');

const testModules = [
    { mass: 12, fuel: 2, totalFuel: 2 },
    { mass: 14, fuel: 2, totalFuel: 2 },
    { mass: 1969, fuel: 654, totalFuel: 966 },
    { mass: 100756, fuel: 33583, totalFuel: 50346 },
];

describe('getFuelForModule', () => {
    testModules.forEach(module => {
        it('should calculate fuel for module', () => {
            expect(getFuelForModule(module)).toEqual(module.fuel);
        });
    });
});

describe('getTotalFuelForModule', () => {
    testModules.forEach(module => {
        it('should calculate total fuel for module', () => {
            expect(getTotalFuelForModule(module)).toEqual(module.totalFuel);
        });
    });
});
