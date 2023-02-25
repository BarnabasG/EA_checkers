import { getInitBoardStats, randomNeg } from "./helper";
import { WeightSet } from "./types";
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

    getScores(): {[key: number]: number} {
        let scores = {};
        for (const [key, val] of Object.entries(this.population)) {
            scores[key] = val['score'];
        }
        return scores;
    }

    nextGeneration(
        size: number = this.size,
        selectionMethod: number = 0,
        mutationVariance: number = 0.1,
        selectionPercent: number = 30,
        keepTopPercent: number = 30
    ): PopulationSet {
        const selectionCount = Math.floor(this.size * (selectionPercent / 100));
        const keepTopCount = Math.max(size > 1 ? 1 : 0, Math.floor(this.size * (keepTopPercent / 100)));
        console.log(selectionCount, keepTopCount)

        this.selection(selectionMethod, size, selectionCount, keepTopCount, mutationVariance);

        return  
    }

    rankPopulation(): PopulationSet {
        //let rankedPopulation = this.population.sort((a: WeightSet, b: WeightSet) => (b.score - a.score));
        const scores = this.getScores();
        const rankedMembers = Object.keys(scores).sort((a: string, b: string) => (scores[b] - scores[a]));
        const rankedPopulation = rankedMembers.map((key) => this.population[key]);
        return rankedPopulation;
    }

    selection(method: number,
        size: number,
        selectionCount: number,
        keepTopCount: number,
        mutationVariance: number
    ): PopulationSet {

        const rankedPopulation: PopulationSet = this.rankPopulation();
        //console.log(rankedPopulation)


        switch (method) {
            case 0:
                return this.selectionRoulette(size, rankedPopulation, selectionCount, keepTopCount, mutationVariance);
            case 1:
                //return this.selectionTournament(size, selectionCount);
            default:
                return //this.selectionRoulette(size, selectionCount);
        }
    }

    selectionRoulette(size: number,
        rankedPopulation: PopulationSet,
        selectionCount: number,
        keepTopCount: number,
        mutationVariance: number
    ): PopulationSet {
        
        let nextGen: PopulationSet = {};
        if (keepTopCount) {
            nextGen = Object.keys(rankedPopulation)
                .slice(0, keepTopCount)
                .map((key) => rankedPopulation[key]);
        }
        console.log(nextGen);
        
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
//console.log(p.size);
//console.log(p.population);
//p.randomiseWeights();
//console.log(p.population);
//console.log(p.getScores());

for (const memberIdx in p.population) {
    p.population[memberIdx]['score'] = Math.random();
}
console.log(p.getScores());
console.log();
p.nextGeneration();

/*const nextGen = Object.keys(p.population)
    .slice(0, 3)
    .map((key) => p.population[key]);

console.log(nextGen);
*/

