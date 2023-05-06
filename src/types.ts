
export type Move = {
    start: number;
    end: number;
    captures: number;
};

export type TestScore = {
    botType?: string;
    score: number;
    winloss: number;
    wins: number;
    losses: number;
    draws: number;
    lossRate: number;
    winRate: number;
    testTime?: number;
};

export interface TestResults {
    [key: string]:  TestScore | number;
}

export enum Player {
    WHITE,
    BLACK,
}

export enum Status {
    PLAYING,
    WHITE_WON,
    BLACK_WON,
    DRAW_REPETITION,
    DRAW_40,
    DRAW_MOVELIMIT,
}

export interface BoardStats {
    [key: string]:  number;
}

export type EvaluationData = {
    eval: number;
    depth: number;
}

export interface Evaluations {
    [key: string]:  EvaluationData;
}

export type WeightSet = {
    weights:  BoardStats;
    score: number;
    evaluationDB: Evaluations;
}

export interface TrainingParams {
    trainingMethod?: string;
    startGeneration?: number;
    depth?: number;
    moveLimit?: number;
    generations?: number;
    populationSize?: number;
    competitionType?: number;
    matchCount?: number
    generationParams?: GenerationParams;
    test?: boolean;
    testDepth?: number;
    popWeightInit?: WeightInit;
}

export enum WeightInit {
    RANDOM,
    RANDOMPOSITIVE,
    ZERO,
    ONE,
    POINTFIVE,
    CAPTURE_PREFER,
    TEST,
    TRAINED
}

export enum SelectionMethod {
    ROULETTE,
    TOURNAMENT,
    ELITIST,
    RANK
}

export interface PopulationParams {
    populationSize?: number;
    population?: Map<number, WeightSet>;
    weightInit?: WeightInit;
    testPopulation?: boolean;
}

export interface GenerationParams {
    selectionMethod?: SelectionMethod
    learningRate?: number
    selectionPercent?: number
    keepTopPercent?: number
    randPercent?: number
    tournamentSize?: number,
    rankBias?: number
}

export type Pattern = {
    [key: number]: TrainingParams;
}

export interface TrainingPatterns {
    [key: string]: Pattern;
}

export type Result = {
    white: number;
    black: number;
    result: number;
}

export type TrainedBot = {
    weights: BoardStats;
    evaluationDB: Evaluations;
}

export type PopStats = {
    [key: string]: {
        sum: number;
        min: number;
        max: number;
        mean: number;
        stdDev: number;
        lowerBound: number;
        upperBound: number;
    };
};


export type HashTable = {
    [key: number]: BoardStats;
}


export class BloomFilter {
    private filter: boolean[]; // Bit array
    private numElements: number;
    private readonly numHashFunctions: number;
    private readonly hashFunctions: ((key: number) => number)[];
  
    constructor(private size: number = 5_000_000) {
        this.filter = new Array(size).fill(false);
        this.numElements = 0;
        this.hashFunctions = [
            (key) => (key * 17) % this.size,
            (key) => (key * 23) % this.size,
            (key) => (key * 29) % this.size,
            (key) => (key * 31) % this.size,
            (key) => (key * 37) % this.size,
            (key) => (key * 41) % this.size,
            (key) => (key * 43) % this.size,
        ];
        this.numHashFunctions = this.hashFunctions.length;
    }

    public add(key: number): void {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            this.filter[index] = true;
        }
        this.numElements++;
    }

    public has(key: number): boolean {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            if (!this.filter[index]) {
                return false;
            }
        }
        return true;
    }
  
    public getSize(): number {
        return this.numElements;
    }
  
    public clear(): void {
        this.filter.fill(false);
        this.numElements = 0;
    }
}