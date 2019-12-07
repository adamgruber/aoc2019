function getFuelForModule({ mass }) {
    return Math.floor(mass / 3) - 2;
}

/**
 * Given a module, calculate the total fuel required for launch
 * taking into account that fuel itself requires additional fuel
 *
 * @param {object} module Module
 */
function getTotalFuelForModule(module) {
    let totalFuel = 0;
    // Get initial fuel for module
    let moduleFuel = getFuelForModule(module);

    // Calculate the additional fuel for added fuel
    // until additional fuel is 0 or less
    while (moduleFuel > 0) {
        totalFuel += moduleFuel;
        moduleFuel = getFuelForModule({ mass: moduleFuel });
    }

    // Return the total
    return totalFuel;
}

// Day 1: Total fuel requirements
function run(modules) {
    return modules.reduce(
        (acc, module) => (acc += getTotalFuelForModule(module)),
        0
    );
}

module.exports = { getFuelForModule, getTotalFuelForModule, run };
