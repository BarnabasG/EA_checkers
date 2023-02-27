import { getInitBoardStats, getRandom, randomNeg, weightedRandom } from "./helper";
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
            keepTopPercent: number = 10
        ): PopulationSet {
        const selectionCount = Math.max(1, Math.floor(this.size * (selectionPercent / 100)));
        const keepTopCount = Math.max(size > 1 ? 1 : 0, Math.floor(this.size * (keepTopPercent / 100)));
        //console.log(selectionCount, keepTopCount)

        const nextGen = this.selection(selectionMethod, size, selectionCount, keepTopCount, mutationVariance);
        this.population = nextGen;

        return nextGen;
    }

    rankPopulation(): PopulationSet {
        //let rankedPopulation = this.population.sort((a: WeightSet, b: WeightSet) => (b.score - a.score));
        const scores = this.getScores();
        const rankedMembers = Object.keys(scores).sort((a: string, b: string) => (scores[b] - scores[a]));
        const rankedPopulation = rankedMembers.map((key) => this.population[key]);
        return rankedPopulation;
    }

    selection(
            method: number,
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

    selectionRoulette(
            size: number,
            rankedPopulation: PopulationSet,
            selectionCount: number,
            keepTopCount: number,
            mutationVariance: number
        ): PopulationSet {
        
        let nextGen: PopulationSet = {};
        if (keepTopCount) {
            //nextGen = Object.keys(rankedPopulation)
            //    .slice(0, keepTopCount)
            //    .map((key) => rankedPopulation[key]);
            
            nextGen = Object.entries(rankedPopulation)
                    .slice(0, keepTopCount)
                    .reduce((result, [key, value]) => {
                        result[key] = value;
                        return result;
                    }, {} as PopulationSet);
        }
        //console.log(nextGen);

        const keys = Object.keys(rankedPopulation);
        //console.log(keys);
        const weights = Object.values(rankedPopulation).map((val) => val['score']);
        //console.log(weights);

        let parents = weightedRandom(keys, weights, selectionCount);
        console.log('selected parents', parents);

        const children = this.generateChildren(parents, size-keepTopCount, mutationVariance, rankedPopulation);
        //console.log('children', children);

        //console.log('nextGen1', nextGen);
        //console.log('children', children);
        for (let i=keepTopCount; i<size; i++) {
            nextGen[i] = children[i-keepTopCount];
        }
        //console.log('nextGen', nextGen);

        this.resetScores();
        
        return nextGen;
    }

    generateChildren(
            parents: number[],
            childCount: number,
            mutationVariance: number,
            rankedPopulation: PopulationSet
        ): WeightSet[] {
            
        let children: WeightSet[] = [];
        for (let i = 0; i < childCount; i++) {
            const selectedParent = rankedPopulation[getRandom(parents)];
            const child = this.mutate(selectedParent, mutationVariance);
            children.push(child);
        }
        return children;
    }

    mutate(
            parent: WeightSet,
            mutationVariance: number
        ): WeightSet {
        let child: WeightSet = {
            'weights': {},
            'score': 0,
        };
        for (let key in parent.weights) {
            child['weights'][key] = parent['weights'][key] + (mutationVariance * randomNeg());
        }
        return child;
    }

    resetScores(): undefined {
        for (const memberIdx in this.population) {
            this.population[memberIdx]['score'] = 0;
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
//console.log(p.size);
//console.log(p.population);
//p.randomiseWeights();
//console.log(p.population);
//console.log(p.getScores());

for (const memberIdx in p.population) {
    p.population[memberIdx]['score'] = Math.random();
}
//console.log(p.getScores());
//console.log();
console.log('1',p.population);
p.nextGeneration();
console.log('2',p.population);
p.nextGeneration();
console.log('3',p.population);

/*const nextGen = Object.keys(p.population)
    .slice(0, 3)
    .map((key) => p.population[key]);

console.log(nextGen);


export interface PopulationSet {
    [key: number]:  WeightSet;
}

let rankedPopulation: PopulationSet;

nextGen = Object.keys(rankedPopulation)
        .slice(0, keepTopCount)
        .map((key) => rankedPopulation[key]);*/