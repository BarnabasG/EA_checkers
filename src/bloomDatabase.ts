/*import { BoardStats, EvaluationData } from "./types";

class BloomFilter {
    private bitArray: boolean[];
    private hashFunctions: ((str: string) => number)[];

    constructor(size: number, hashFunctions: ((str: string) => number)[]) {
        this.bitArray = new Array(size).fill(false);
        this.hashFunctions = hashFunctions;
    }

    public add(key: string): void {
        for (const hashFunction of this.hashFunctions) {
            const index = hashFunction(key) % this.bitArray.length;
            this.bitArray[index] = true;
        }
    }

    public mightContain(key: string): boolean {
        for (const hashFunction of this.hashFunctions) {
            const index = hashFunction(key) % this.bitArray.length;
            if (!this.bitArray[index]) {
                return false;
            }
        }
        return true;
    }
}

function djb2(str: string): number {
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
}


export class BloomHashMapBoardStats {
    private readonly loadFactor: number;
    private readonly hashFunctions: ((str: string) => number)[];
    private table: Array<{ key: string, value: BoardStats }[]>;
    private size: number;
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

    public put(key: string, value: BoardStats): void {
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

    public get(key: string): BoardStats | undefined {
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

    private getBucket(hash: number): { key: string, value: BoardStats }[] {
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
}

export class BloomHashMapEvalData {
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

/*export class BloomHashMap {
    private data: { [key: string]: EvaluationData };
    private bloomFilter: BloomFilter;

    constructor(size: number, hashFunctions: ((str: string) => number)[]) {
        this.data = {};
        this.bloomFilter = new BloomFilter(size, hashFunctions);
    }

    public put(key: string, value: EvaluationData): void {
        this.data[key] = value;
        this.bloomFilter.add(key);
    }

    public get(key: string): EvaluationData | undefined {
        if (this.bloomFilter.mightContain(key)) {
            return this.data[key];
        } else {
            return undefined;
        }
    }
}*/
