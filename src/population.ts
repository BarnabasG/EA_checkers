import { getInitBoardStats, getRandom, randomNeg, weightedRandom } from "./helper";
import { BoardStats, GenerationParams, WeightSet } from "./types";
import { PopulationSet } from "./types";


export class Population {

    readonly size: number;
    //population: PopulationSet;
    population: Map<number, WeightSet>;

    constructor (
        size: number,
        //population: PopulationSet = generateInitialPopulation(size),
        population: Map<number, WeightSet> = generateInitialPopulation(size),
    ) {
        this.size = size;
        this.population = population;
        this.randomiseWeights();
        this.addTestBot();
    }

    randomiseWeights(): void {
        // Iterate over each entry in the Map
        for (const [key, weightSet] of this.population.entries()) {
            // Iterate over each property of the BoardStats object
            const newWeights: BoardStats = {};
            for (const prop in weightSet.weights) {
                //if (Object.prototype.hasOwnProperty.call(weightSet.weights, prop)) {
                // Assign a random value to the property
                newWeights[prop] = randomNeg() //* Math.random();
                //}
            }

            const newWeightSet: WeightSet = {
                weights: newWeights,
                score: weightSet.score
            };

            // Set the updated weightSet back into the Map
            this.population.set(key, newWeightSet);
        }
    }

    randomiseWeights1(): void {
        //for (const memberIdx in this.population) {
        //    for (let key in this.population[memberIdx]['weights']) {
        //        if (key != '-1') this.population[memberIdx]['weights'][key] = randomNeg()
        //    }
        //}
        let rand: number;
        //let v: WeightSet;

        //issue with updating all keys from byref vars in map
        //const tmpPop = new Map(Array.from(this.population));

        let tmpPop = new Map<number, WeightSet>();

        for (const [key, value] of this.population.entries()) {
            console.log()
            //console.log(this.population.get(key).score, value.score)
            //value['score']++;
            //console.log(this.population.get(key).score, value.score)
            
            if (key == -1) continue;
            //v = value;
            for (const weightKey in value['weights']) {
                rand = randomNeg();
                console.log(key, weightKey, rand)
                //value['weights'][weightKey] = rand;
                let v = value;
                v['weights'][weightKey] = rand;
                tmpPop.set(key, v);
            }
            //this.population.set(key, value);
        }

        for (const [key, value] of tmpPop.entries()) {
            this.population.set(key, value);
        }
    }

    getScores(): {[key: number]: number} {
        let scores = {};
        for (const [key, val] of Object.entries(this.population)) {
            if (key != '-1') scores[key] = val['score'];
        }
        return scores;
    }

    /*nextGeneration(
            size: number = this.size,
            selectionMethod: number = 0,
            mutationVariance: number = 0.1,
            selectionPercent: number = 30,
            keepTopPercent: number = 10
        ): PopulationSet {*/
    nextGeneration(generationParams?: GenerationParams): Map<number, WeightSet> {//PopulationSet {
        const {
            size = this.size,
            selectionMethod = 0,
            mutationVariance = 0.1,
            selectionPercent = 30,
            keepTopPercent = 10
        } = generationParams;
        const selectionCount = Math.max(1, Math.floor(this.size * (selectionPercent / 100)));
        const keepTopCount = Math.max(size > 1 ? 1 : 0, Math.floor(this.size * (keepTopPercent / 100)));
        //console.log(selectionCount, keepTopCount)

        const nextGen = this.selection(selectionMethod, size, selectionCount, keepTopCount, mutationVariance);
        this.population = nextGen;

        return nextGen;
    }

    rankPopulation(): Map<number, WeightSet> {

        const rankedPopulation = new Map<number, WeightSet>(
            [...this.population.entries()].sort((a, b) => {
            //return a[1].score - b[1].score;
            if (a[0] === -1) {
                return 1; // a is last
            } else if (b[0] === -1) {
                return -1; // b is last
            } else {
                return b[1].score - a[1].score; // sort by score
            }
        }));

        /*const rankedPopulation = Object.entries(this.population)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => b.value.score - a.value.score)
            .reduce((acc, { key, value }) => {
                acc[key] = value;
                return acc;
            }, {} as PopulationSet);*/
        
        //const scores = this.getScores();
        //const rankedMembers = Object.keys(scores).sort((a: string, b: string) => (scores[b] - scores[a]));
        
        //console.log('rankedMembers', rankedMembers)

        //const rankedPopulation: PopulationSet = {};
        //rankedMembers.forEach((key) => {
        //    rankedPopulation[key] = this.population[key];
        //});


        console.log('rankedPopulation', rankedPopulation)
        return rankedPopulation;
    }

    selection(
            method: number,
            size: number,
            selectionCount: number,
            keepTopCount: number,
            mutationVariance: number
        ): Map<number, WeightSet> {//PopulationSet {

        //const rankedPopulation: PopulationSet = this.rankPopulation();
        const rankedPopulation: Map<number, WeightSet> = this.rankPopulation();
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
            rankedPopulation: Map<number, WeightSet>, //PopulationSet,
            selectionCount: number,
            keepTopCount: number,
            mutationVariance: number
        ): Map<number, WeightSet> {//PopulationSet {
        
        let nextGen: Map<number, WeightSet>;//PopulationSet = {};
        if (keepTopCount) {
            //nextGen = Object.keys(rankedPopulation)
            //    .slice(0, keepTopCount)
            //    .map((key) => rankedPopulation[key]);
            
            nextGen = Object.entries(rankedPopulation)
                    .slice(0, keepTopCount)
                    .reduce((result, [key, value]) => {
                        result[key] = value;
                        return result;
                    }, {} as Map<number, WeightSet>);//PopulationSet);
        }
        //console.log(nextGen);

        //const keys = Object.keys(rankedPopulation);
        const keys = [...rankedPopulation.keys()];
        //console.log(keys);
        //const weights = Object.values(rankedPopulation).map((val) => val['score']);
        const weights = [...rankedPopulation.values()].map((weightSet) => weightSet.score);
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
            rankedPopulation: Map<number, WeightSet>//PopulationSet
        ): WeightSet[] {
            
        let children: WeightSet[] = [];
        for (let i = 0; i < childCount; i++) {
            const selectedParent = rankedPopulation.get(getRandom(parents));
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

    resetScores(): void {
        //for (const memberIdx in this.population) {
        //let ws: WeightSet;
        //for (const memberIdx in this.population.keys()) {
            //this.population[memberIdx]['score'] = 0;
        //    ws = this.population.get(+memberIdx);
        //    this.population.set(+memberIdx, ws => ws.score = 0);
        //}
        for (const [key, value] of this.population.entries()) {
            value.score = 0;
            this.population.set(key, value);
        }
    }

    addTestBot(): void {
        this.population.set(-1, {
            'weights': getInitBoardStats(1),
            'score': 0,
        });
    }

}



function generateInitialPopulation(size: number): Map<number, WeightSet> {//PopulationSet {
    //let population: PopulationSet = {};
    let population: Map<number, WeightSet> = new Map();
    const weights = getInitBoardStats(1);
    for (let i = 0; i < size; i++) {
        population.set(i, {
            'weights': weights,
            'score': 0,
        });
    }
    return population;
}



/*let p = new Population(10);
//console.log(p.size);
//console.log(p.population);
//p.randomiseWeights();
//console.log(p.population);
//console.log(p.getScores());

//for (const memberIdx in p.population) {
//    p.population[memberIdx]['score'] = Math.random();
//}

for (const [key, value] of p.population.entries()) {
    value.score = Math.random();
    p.population.set(key, value);
}

console.log(p.getScores());
p.rankPopulation();*/


/*//console.log();
console.log('1',p.population);
p.nextGeneration();
console.log('2',p.population);
p.nextGeneration();
console.log('3',p.population);
*/

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
