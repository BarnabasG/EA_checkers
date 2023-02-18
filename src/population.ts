import { getInitBoardStats, randomNeg } from "./helper";
import { PopulationSet } from "./types";


export class Population {

    readonly size: number;
    population: PopulationSet;

    constructor (
        size: number,
        population: PopulationSet = generateInitialPopulation(size),
    ) {
        this.size = size;
        this.population = population;
    }

    randomiseWeights(): undefined {
        for (const memberIdx in this.population) {
            for (let key in this.population[memberIdx]['weights']) {
                this.population[memberIdx]['weights'][key] = randomNeg()
            }
        }
        return
    }





}


function generateInitialPopulation(size: number): PopulationSet {
    let population: PopulationSet = {};
    for (let i = 0; i < size; i++) {
        const weights = getInitBoardStats(1);
        population[i] = {
                'weights': weights,
                'score': 0,
        };
    }
    return population;
}


let p = new Population(10);
console.log(p.size);
console.log(p.population);
p.randomiseWeights();
console.log(p.population);
