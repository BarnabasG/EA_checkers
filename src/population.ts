import { generateInitialPopulation, getRandom, getWeights, permutations, randomNeg, weightedRandom } from "./helper";
import { BoardStats, GenerationParams, Player, PopulationParams, Status, WeightInit, WeightSet } from "./types";


export class Population {

    public size: number;
    //population: PopulationSet;
    public population: Map<number, WeightSet>;

    constructor (
        //size: number,
        //population: PopulationSet = generateInitialPopulation(size),
        //population: Map<number, WeightSet> = generateInitialPopulation(size),
        populationParams: PopulationParams
    ) {
        if (populationParams.testPopulation) {
            this.size = 2
            this.population = new Map();
            this.addTestBot(0);
            this.addTestBot(1);
        } else {
            if (populationParams.population) {
                this.size = populationParams.population.size;
                this.population = populationParams.population;
            } else {
                this.size = populationParams.populationSize!;
                populationParams.population = generateInitialPopulation(this.size, populationParams.weightInit),
                this.population = populationParams.population;
            }
        }
        //this.randomiseWeights();
        //this.addTestBot();
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
                score: weightSet.score,
                evaluationDB: weightSet.evaluationDB
            };

            // Set the updated weightSet back into the Map
            this.population.set(key, newWeightSet);
        }
    }

    //for each member of the population, clear the saved evaluation
    clearDatabases() {
        this.population.forEach((weightSet, key) => {
            weightSet.evaluationDB = {};
        })
    }


    getScores(): {[key: number]: number} {
        let scores = {};
        for (const [key, val] of this.population.entries()) {
            if (key >= 0) (scores as any)[key] = val['score'];
        }
        return scores;
    }

    getWeights(): BoardStats[] {
        let weights: BoardStats[] = [];
        for (const [key, val] of this.population.entries()) {
            if (key >= 0) weights.push(val['weights']);
        }
        return weights;
    }


    nextGeneration(size: number = this.size, generationParams: GenerationParams = {}): void {//Map<number, WeightSet> {//PopulationSet {
        console.log('nextGeneration', generationParams)
        //console.log(this)
        //if (size === undefined) size = this.size;
        const {
            selectionMethod = 0,
            learningRate = 0.1,
            selectionPercent = 30,
            keepTopPercent = 10,
            randPercent = 10,
            tournamentSize = 5,
            rankBias = 1
        } = generationParams;
        //const selectionCount1 = Math.max(size > 2 ? 2 : 1, Math.floor(this.size * (selectionPercent / 100)));
        //const keepTopCount1 = Math.max(size > 1 ? 1 : 0, Math.floor(this.size * (keepTopPercent / 100)));
        //const randCount1 = Math.max(size > 1 ? 1 : 0, Math.floor(this.size * (randPercent / 100)));

        // percentage of current generation to use as parents
        const selectionCount = Math.max(size > 2 ? 2 : 1, Math.floor(this.size * (selectionPercent / 100)));
        // percentage of top bots to keep for next generation
        const keepTopCount = Math.max(size > 1 ? 1 : 0, Math.floor(size * (keepTopPercent / 100)));
        // percentage of random bots to add next generation
        const randCount = Math.max(size > 1 ? 1 : 0, Math.floor(size * (randPercent / 100)));

        //console.log('old',selectionCount1, keepTopCount1, randCount1)
        //console.log('new',selectionCount, keepTopCount, randCount)

        const nextGen = this.selection(selectionMethod, size, selectionCount, keepTopCount, randCount, learningRate, tournamentSize, rankBias);
        this.population = nextGen;
        this.size = size;
        console.log('new generation size:', this.size);
        //this.addTestBot();

        //console.log('nextGen', nextGen)

        //return nextGen;
    }

    rankPopulation(): Map<number, WeightSet> {

        const rankedPopulation = new Map<number, WeightSet>(
            [...this.population.entries()].sort((a, b) => {
            //return a[1].score - b[1].score;
            if (a[0] < 0) {
                return 1; // a is last
            } else if (b[0] < 0) {
                return -1; // b is last
            } else {
                return b[1].score - a[1].score; // sort by score
            }
        }));

        return rankedPopulation;
    }

    selection(
            method: number,
            size: number,
            selectionCount: number,
            keepTopCount: number,
            randCount: number,
            learningRate: number,
            tournamentSize: number,
            rankBias: number
        ): Map<number, WeightSet> {//PopulationSet {

        //const rankedPopulation: PopulationSet = this.rankPopulation();
        const rankedPopulation: Map<number, WeightSet> = this.rankPopulation();
        //console.log('rankedPopulation', rankedPopulation)

        let nextGen: Map<number, WeightSet> = new Map();

        if (keepTopCount) {
            const top = [...rankedPopulation.values()].slice(0, keepTopCount);
            for (let i=0; i<top.length; i++) {
                nextGen.set(i, top[i]);
            }
        }
        console.log('keepTop', [...nextGen.keys()])

        if (randCount) {
            for (let i = 0; i < randCount; i++) {
                nextGen.set(i+keepTopCount, {
                    'weights': getWeights(WeightInit.RANDOM),//getRandomWeights(),
                    'score': 0,
                    'evaluationDB': {},
                });
            }
        }
        console.log('+rands', [...nextGen.keys()])

        console.log('selectionMethod', method)

        switch (method) {
            case 0:
                return this.selectionRoulette(nextGen, size, rankedPopulation, selectionCount, learningRate);
            case 1:
                return this.selectionTournament(nextGen, size, rankedPopulation, selectionCount, learningRate, tournamentSize);
            case 2:
                return this.selectionElitist(nextGen, size, rankedPopulation, selectionCount, learningRate);
            case 3:
                return this.selectionRank(nextGen, size, rankedPopulation, selectionCount, learningRate, rankBias);
            default:
                return this.selectionRoulette(nextGen, size, rankedPopulation, selectionCount, learningRate);
        }
    }

    selectionRoulette(
        nextGen: Map<number, WeightSet>,
        size: number,
        rankedPopulation: Map<number, WeightSet>, //PopulationSet,
        selectionCount: number,
        learningRate: number
    ): Map<number, WeightSet> {//PopulationSet {

        const keys = [...rankedPopulation.keys()];
        const weights = [...rankedPopulation.values()].map((weightSet) => weightSet.score);

        let parents = weightedRandom(keys, weights, selectionCount);
        console.log('selected parents', parents);

        const children = this.generateChildren(parents, size-nextGen.size, learningRate, rankedPopulation);

        const prepopSize = nextGen.size;
        for (let i=prepopSize; i<size; i++) {
            //console.log('set', i, children[i-propopSize])
            //console.log('0', nextGen.get(0)!.weights)
            nextGen.set(i, children[i-prepopSize]);
        }

        this.resetScores();
        return nextGen;
    }


    selectionTournament(
        nextGen: Map<number, WeightSet>,
        size: number,
        rankedPopulation: Map<number, WeightSet>, //PopulationSet,
        selectionCount: number,
        learningRate: number,
        tournamentSize: number
    ): Map<number, WeightSet> {

        function tournament(popSize: number, tournamentSize: number): number {
            let bestScore = -Infinity;
            let bestKey = -1;

            for (let i=0; i<tournamentSize; i++) {
                let index = Math.floor(Math.random() * popSize);
                const score = rankedPopulation.get(index)!.score;
                if (score > bestScore) {
                    bestScore = score;
                    bestKey = index;
                }
            }

            return bestKey;
        }
        
        let parents: number[] = [];
        for (let i = 0; i < selectionCount; i++) {
            parents.push(tournament(rankedPopulation.size, tournamentSize));
        }

        const children = this.generateChildren(parents, size-nextGen.size, learningRate, rankedPopulation);

        const prepopSize = nextGen.size;
        for (let i=prepopSize; i<size; i++) {
            nextGen.set(i, children[i-prepopSize]);
        }

        this.resetScores();
        return nextGen;
    
    }


    selectionElitist(
        nextGen: Map<number, WeightSet>,
        size: number,
        rankedPopulation: Map<number, WeightSet>, //PopulationSet,
        selectionCount: number,
        learningRate: number
    ): Map<number, WeightSet> {

        let elites = [...rankedPopulation.values()].slice(0, selectionCount);

        let finalCount = nextGen.size + elites.length;
        for (let i=nextGen.size; i<finalCount; i++) {
            nextGen.set(i, elites[i-nextGen.size]);
        }
        
        const parents = [...rankedPopulation.keys()].slice(0, selectionCount);
        console.log('selected parents', parents);

        const children = this.generateChildren(parents, size-nextGen.size, learningRate, rankedPopulation);

        for (let i=nextGen.size; i<size; i++) {
            nextGen.set(i, children[i-nextGen.size]);
        }
        this.resetScores();
        
        return nextGen;
    }

    selectionRank(
        nextGen: Map<number, WeightSet>,
        size: number,
        rankedPopulation: Map<number, WeightSet>, //PopulationSet,
        selectionCount: number,
        learningRate: number,
        rankBias: number
    ): Map<number, WeightSet> {//PopulationSet {

        const keys = [...rankedPopulation.keys()];
        //const ranks = [...Array(keys.length).keys()].map((i) => Math.pow(i+1, rankBias));
        const ranks = [...Array.from({length: keys.length}, (_, i) => keys.length - i)].map((i) => Math.pow(i, rankBias));
        console.log(ranks)

        let parents = weightedRandom(keys, ranks, selectionCount);
        console.log('selected parents', parents);

        const children = this.generateChildren(parents, size-nextGen.size, learningRate, rankedPopulation);

        const prepopSize = nextGen.size;
        for (let i=prepopSize; i<size; i++) {
            nextGen.set(i, children[i-prepopSize]);
        }

        this.resetScores();
        return nextGen;
    }



    generateChildren(
            parents: number[],
            childCount: number,
            learningRate: number,
            rankedPopulation: Map<number, WeightSet>//PopulationSet
        ): WeightSet[] {
            
        let children: WeightSet[] = [];
        for (let i = 0; i < childCount; i++) {
            const selectedParent = rankedPopulation.get(getRandom(parents))!;
            const child = this.mutate(selectedParent, learningRate);
            children.push(child);
        }
        return children;
    }

    mutate(
            parent: WeightSet,
            learningRate: number
        ): WeightSet {
        let child: WeightSet = {
            'weights': {},
            'score': 0,
            //'evaluationDB': new BloomHashMapEvalData()
            'evaluationDB': {},
        };
        for (let key in parent.weights) {
            //child['weights'][key] = parent['weights'][key] + (learningRate * randomNeg());
            child['weights'][key] = parent['weights'][key] + randomNeg(learningRate);
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

    getBestWeights(): BoardStats {
        const rankedPopulation = this.rankPopulation();
        const bestWeights = rankedPopulation.get(rankedPopulation.keys().next().value)!.weights;
        console.log('bestWeights', bestWeights)
        return bestWeights;
    }

    // get the indexes of the best n members of the population
    getBestNMembers(n: number): number[] {
        //const rankedPopulation = this.rankPopulation();
        //const bestNMembers = Array.from(rankedPopulation.keys()).slice(0, n);
        //console.log('bestNMembers', bestNMembers)
        //return bestNMembers;
        const ranked = [...this.population.entries()].sort((a, b) => b[1].score - a[1].score);
        //console.log('ranked', ranked);
        const topNPairs = ranked.slice(0, n);
        //console.log('topNPairs', topNPairs)
        const topNKeys = topNPairs.map(pair => pair[0]);
        //console.log('topNKeys', topNKeys)
        return topNKeys;
    }

    addTestBot(id?: number): number {
        if (id === undefined) id = -1;
        this.population.set(id, {
            'weights': getWeights(WeightInit.POINTFIVE),
            'score': 0,
            //'evaluationDB': new BloomHashMapEvalData()
            'evaluationDB': {},
        });
        return id;
    }

    addTestBot2(id?: number): number {
        if (id === undefined) id = -2;
        this.population.set(id, {
            'weights': getWeights(WeightInit.CAPTURE_PREFER),
            'score': 0,
            //'evaluationDB': new BloomHashMapEvalData()
            'evaluationDB': {},
        });
        return id;
    }

    destroyBot(id: number): void {
        this.population.delete(id);
    }

    initPopFromWeights(weights: BoardStats[]): void {
        this.population.clear();
        for (let i = 0; i < weights.length; i++) {
            this.population.set(i, {
                'weights': weights[i],
                'score': 0,
                //'evaluationDB': new BloomHashMapEvalData()
                'evaluationDB': {},
            });
        }
    }

}



/*function generateInitialPopulation(size: number): Map<number, WeightSet> {//PopulationSet {
    //let population: PopulationSet = {};
    let population: Map<number, WeightSet> = new Map();
    //const weights = getInitBoardStats(1);
    for (let i = 0; i < size; i++) {
        population.set(i, {
            //'weights': weights,
            'weights': getRandomWeights(),
            'score': 0,
            'evaluationDB': {},
        });
    }
    return population;
}*/



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
p.rankPopulation();


//console.log();
console.log('1', p);
//console.log('1',p.population);
p.nextGeneration();
console.log('2',p);
//console.log('2',p.population);
p.nextGeneration();
console.log('3',p);
//console.log('3',p.population);
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
