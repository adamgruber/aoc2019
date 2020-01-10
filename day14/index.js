class Reaction {
    constructor(reaction) {
        const { inputs, output, producesFuel, usesOre } = this.parseReaction(
            reaction
        );
        this.inputs = inputs;
        this.output = output;
        this.producesFuel = producesFuel;
        this.usesOre = usesOre;
    }

    parseReaction(reaction) {
        const matcher = /(\d+)\s([A-Z]+)/;
        const [rawInputs, rawOutput] = reaction.split(' => ');
        const inputs = rawInputs.split(', ').map(rawInput => {
            const match = rawInput.match(matcher);
            return {
                name: match[2],
                quantity: parseFloat(match[1]),
            };
        });
        const outputMatch = rawOutput.match(matcher);
        return {
            inputs: inputs,
            output: {
                name: outputMatch[2],
                quantity: parseFloat(outputMatch[1]),
            },
            producesFuel: outputMatch[2] === 'FUEL',
            usesOre: inputs.some(input => input.name === 'ORE'),
        };
    }
}

function parseReactions(reactions) {
    reactions = reactions.split('\n').map(reaction => new Reaction(reaction));
    return reactions;
}

class Nanofactory {
    constructor(reactions) {
        this.reactions = parseReactions(reactions);
        this.fuelReaction = this.reactions.filter(
            reaction => reaction.producesFuel
        )[0];
    }

    findReactionForInput(input) {
        return this.reactions.filter(
            reaction => reaction.output.name === input.name
        )[0];
    }

    reduceInputs(acc, inputs) {
        return inputs.reduce((acc, input) => {
            const reaction = this.findReactionForInput(input);
            if (reaction.usesOre) {
                if (!acc[input.name]) {
                    acc[input.name] = 0;
                }
                acc[input.name] += input.quantity;
            } else {
                const nextInputs = reaction.inputs.reduce((acc2, nextInput) => {
                    console.log(
                        input.quantity,
                        nextInput.quantity,
                        reaction.output.quantity
                    );

                    let qty = nextInput.quantity;

                    if (reaction.output.quantity <= input.quantity) {
                        qty = Math.ceil(
                            (input.quantity * nextInput.quantity) /
                                reaction.output.quantity
                        );
                    }

                    console.log(nextInput.name, qty);

                    const inputsArr = Array(qty).fill({
                        name: nextInput.name,
                        quantity: 1,
                    });
                    acc2 = acc2.concat(inputsArr);
                    return acc2;
                }, []);

                this.reduceInputs(acc, nextInputs);
            }
            return acc;
        }, acc);
    }

    getOreToFuelRatio() {
        const oreReactionsByChemical = this.reduceInputs(
            {},
            this.fuelReaction.inputs
        );

        console.log(oreReactionsByChemical);

        const totalOre = Object.keys(oreReactionsByChemical).reduce(
            (acc, chemical) => {
                const chemicalQuantity = oreReactionsByChemical[chemical];
                const oreReaction = this.findReactionForInput({
                    name: chemical,
                });
                const numReactions = Math.ceil(
                    chemicalQuantity / oreReaction.output.quantity
                );
                // console.log(chemical, chemicalQuantity, numReactions);
                acc += oreReaction.inputs[0].quantity * numReactions;
                return acc;
            },
            0
        );

        return totalOre;
    }
}

module.exports = Nanofactory;
