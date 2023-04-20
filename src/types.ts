//import { BloomHashMapEvalData } from './bloomDatabase';

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
    //board: string;
    eval: number;
    depth: number;
}

export interface Evaluations {
    [key: string]:  EvaluationData;
}

//Map(BoardStats, EvaluationData)

export type WeightSet = {
    weights:  BoardStats;
    score: number;
    evaluationDB: Evaluations;//Map<BoardStats, EvaluationData>
    //evaluationDB: BloomHashMapEvalData //Evaluations;//Map<BoardStats, EvaluationData>
}

export interface TrainingParams {
    //standard?: boolean;
    trainingMethod?: string;
    standardStartGeneration?: number;
    depth?: number;
    moveLimit?: number;
    generations?: number;
    populationSize?: number;
    competitionType?: number;
    matchCount?: number
    //selectionMethod?: number;
    //learningRate?: number;
    //selectionPercent?: number;
    //keepTopPercent?: number;
    //randPercent?: number;
    //tournamentSize?: number;
    //rank
    generationParams?: GenerationParams;
    test?: boolean;
    testDepth?: number;
    popWeightInit?: WeightInit;
    //finalGen?: boolean;//
    //populationSizePattern?: number[];
}

export enum WeightInit {
    RANDOM,
    ZERO,
    ONE,
    POINTFIVE,
    CAPTURE_PREFER,
    TEST
}

export interface PopulationParams {
    populationSize?: number;
    population?: Map<number, WeightSet>;
    weightInit?: WeightInit;
}

export interface GenerationParams {
    //size?: number
    selectionMethod?: number
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

//export interface BoardDatabase {
//    [key: string]: BoardStats;
//}

export type Result = {
    white: number;
    black: number;
    result: number;
}

export type TrainedBot = {
    weights: BoardStats;
    //evaluationDB: BloomHashMapEvalData;
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




/*export type BoardStats = {
    men: : number;
    kings: number;
    avrDist: number;
    backline: number;
    corners: number;
    edges: number;
    centre2: number;
    centre4: number;
    centre8: number;
    defended: number;
    attacks: number;
}*/

export type HashTable = {
    [key: number]: BoardStats;
}

/*function djb2(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash;
}

function fnv1a(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash *= 16777619;
    }
    return hash;
}*/


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
  
    //public isEmpty(): boolean {
    //    return this.numElements === 0;
    //}
  
    public clear(): void {
        this.filter.fill(false);
        this.numElements = 0;
    }
}


/*export class BloomHashMapBoardStats {
    private filter: [number, BoardStats][]; // Array of [key, value] pairs
    private numElements: number;
    private readonly numHashFunctions: number;
    private readonly hashFunctions: ((key: number) => number)[];
  
    constructor(private size: number = 5_000_000) {
        this.filter = new Array(size);
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

  
    public put(key: number, value: BoardStats): void {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            this.filter[index] = [key, value];
        }
        this.numElements++;
    }
  
    public get(key: number): BoardStats | undefined {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            const pair = this.filter[index];
            if (pair === undefined || pair[0] !== key) {
                return undefined;
            }
        }
        const pair = this.filter[this.hashFunctions[0](key)];
        return pair[1];
    }

    public has(key: number): boolean {
        for (let i = 0; i < this.hashFunctions.length; i++) {
            const index = this.hashFunctions[i](key);
            const pair = this.filter[index];
            if (pair === undefined || pair[0] !== key) {
                return false;
            }
        }
        return true;
    }
  
    public getSize(): number {
        return this.numElements;
    }
  
    public isEmpty(): boolean {
        return this.numElements === 0;
    }
  
    public clear(): void {
        this.filter = new Array(this.size);
        this.numElements = 0;
    }
}*/
  


/*class BloomFilterHashMap {
    private size: number;
    private readonly hashFunctions: ((key: number) => number)[];
    private readonly bitArray: boolean[];
    private numElements: number;
    private numHashes: number;
  
    constructor(size: number) {
      this.size = size;
      this.hashFunctions = [
        (key) => (key * 17) % this.size,
        (key) => (key * 23) % this.size,
        (key) => (key * 29) % this.size,
      ];
      this.bitArray = new Array<boolean>(size).fill(false);
      this.numElements = 0;
      this.numHashes = this.hashFunctions.length;
    }
  
    public put(key: number, value: number): void {
      if (this.numElements >= this.size) {
        this.resize();
      }
  
      for (let i = 0; i < this.numHashes; i++) {
        const index = this.hashFunctions[i](key);
        this.bitArray[index] = true;
      }
  
      this.numElements++;
    }
  
    public get(key: number): number | undefined {
      for (let i = 0; i < this.numHashes; i++) {
        const index = this.hashFunctions[i](key);
        if (!this.bitArray[index]) {
          return undefined;
        }
      }
  
      return key;
    }
  
    private resize(): void {
      const newSize = this.size * 2;
      const newBitArray = new Array<boolean>(newSize).fill(false);
  
      for (let i = 0; i < this.size; i++) {
        newBitArray[i] = this.bitArray[i];
      }
  
      this.bitArray.length = newSize;
      this.bitArray.fill(false);
      this.numElements = 0;
      this.size = newSize;
      this.numHashes = Math.round((Math.log(2) * newSize) / this.numElements);
  
      for (let i = 0; i < this.numHashes; i++) {
        this.hashFunctions.push((key) => (key * 31) % newSize);
      }
    }
}*/
  
  
  



/*export class BloomHashMapBoardStats1 {
    private readonly loadFactor: number;
    private readonly hashFunctions: ((str: string) => number)[];
    private table: Array<{ key: number/*string*, value: BoardStats }[]>;
    public size: number;
    private capacity: number;
    private threshold: number;

    constructor(initialCapacity: number = 50000, loadFactor: number = 0.75, hashFunctions: ((str: string) => number)[] = [djb2, fnv1a]) {
        this.loadFactor = loadFactor;
        this.hashFunctions = hashFunctions;
        this.capacity = initialCapacity;
        this.size = 0;
        this.threshold = Math.floor(this.capacity * this.loadFactor);
        this.table = new Array(this.capacity);
    }

    //public put(key: string, value: BoardStats): void {
    public put(key: number, value: BoardStats): void {
        if (this.size >= this.threshold) {
            this.resize(this.capacity * 2);
        }

        const hash = this.hash(key);
        const bucket = this.getBucket(hash);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket[i].value = value;
                return;
            }
        }

        bucket.push({ key, value });
        this.size++;
    }

    /*public get(key: number/*string*): BoardStats | undefined {
        const hash = this.hash(key);
        const bucket = this.getBucket(hash);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                return bucket[i].value;
            }
        }

        return undefined;
    }*

    //public has(key: string): boolean {
    public has(key: number): boolean {
        const hash = this.hash(key);
        const bucket = this.getBucket(hash);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                return true;
            }
        }

        return false;
    }

    //private hash(key: string): number {
    private hash(key: number): number {
        let hash = 0;
        for (const hashFunction of this.hashFunctions) {
            hash += hashFunction(key);
        }
        return hash;
    }

    //private getBucket(hash: number): { key: string, value: BoardStats }[] {
    private getBucket(hash: number): { key: number, value: BoardStats }[] {
        const index = hash % this.capacity;
        if (!this.table[index]) {
            this.table[index] = [];
        }
        return this.table[index];
    }

    private resize(newCapacity: number): void {
        const oldTable = this.table;
        this.capacity = newCapacity;
        this.threshold = Math.floor(this.capacity * this.loadFactor);
        this.table = new Array(this.capacity);
        this.size = 0;

        for (const bucket of oldTable) {
            if (!bucket) {
                continue;
            }

            for (const { key, value } of bucket) {
                this.put(key, value);
            }
        }
    }
}*/

/*export class BloomHashMapEvalData {
    private readonly loadFactor: number;
    private readonly hashFunctions: ((str: string) => number)[];
    private table: Array<{ key: string, value: EvaluationData }[]>;
    public size: number;
    private capacity: number;
    private threshold: number;

    constructor(initialCapacity: number = 1000, loadFactor: number = 0.75, hashFunctions: ((str: string) => number)[] = [djb2, fnv1a]) {
        this.loadFactor = loadFactor;
        this.hashFunctions = hashFunctions;
        this.capacity = initialCapacity;
        this.size = 0;
        this.threshold = Math.floor(this.capacity * this.loadFactor);
        this.table = new Array(this.capacity);
    }

    public put(key: string, value: EvaluationData): void {
        if (this.size >= this.threshold) {
            this.resize(this.capacity * 2);
        }

        const hash = this.hash(key);
        const bucket = this.getBucket(hash);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket[i].value = value;
                return;
            }
        }

        bucket.push({ key, value });
        this.size++;
    }

    public get(key: string): EvaluationData | undefined {
        const hash = this.hash(key);
        const bucket = this.getBucket(hash);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                return bucket[i].value;
            }
        }

        return undefined;
    }

    public has(key: string): boolean {
        const hash = this.hash(key);
        const bucket = this.getBucket(hash);

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                return true;
            }
        }

        return false;
    }

    private hash(key: string): number {
        let hash = 0;
        for (const hashFunction of this.hashFunctions) {
            hash += hashFunction(key);
        }
        return hash;
    }

    private getBucket(hash: number): { key: string, value: EvaluationData }[] {
        const index = hash % this.capacity;
        if (!this.table[index]) {
            this.table[index] = [];
        }
        return this.table[index];
    }

    private resize(newCapacity: number): void {
        const oldTable = this.table;
        this.capacity = newCapacity;
        this.threshold = Math.floor(this.capacity * this.loadFactor);
        this.table = new Array(this.capacity);
        this.size = 0;

        for (const bucket of oldTable) {
            if (!bucket) {
                continue;
            }

            for (const { key, value } of bucket) {
                this.put(key, value);
            }
        }
    }
}*/