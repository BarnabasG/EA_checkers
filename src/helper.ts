import { BoardStats, Status, Result, WeightSet, WeightInit, Player, Move } from "./types";


export function decToBin(dec: number): string {
    return (dec >>> 0).toString(2);
}

export function generateBin(n: number = 32): Record<number, number> {
    const BIN: Record<number, number> = [];
    BIN[0] = 1;
    for (let i=1; i<n; i++) {
        BIN[i] = BIN[i-1] * 2;
    }
    return BIN;
}

export function binIndexesToBin(binIndexes: number[]): number {
    let bin = 0;
    for (let i=0; i<binIndexes.length; i++) {
        bin += 1 << binIndexes[i];
        //console.log(binIndexes[i], bin)
    }
    return bin;
}

export function pad(n: string, width=32, z: string = '0') {
    return (z.repeat(width) + String(n)).slice(String(n).length)
}

export function getBoardString(n: number | string) {
    if (typeof n === 'string') {
        n = parseInt(n, 2);
    }
    return pad(decToBin(n));
}

export function getPresentBits(value: number): number[] {

    const bitArr: number[] = [];

    for (let index = 0; index < 32; index++) {
        let bit = value & (1 << index);
        if (bit) bitArr.push(bit);
    }
  
    return bitArr;
}

export function getPresentBitIndexes(value: number): number[] {

    const indexArr: number[] = [];

    for (let index = 0; index < 32; index++) {
        if (value & (1 << index)) indexArr.push(index);
    }
  
    return indexArr;
}

//generate a printable board from a binary integer or string
export function getBoardFromBin(n: number | string) {

    let lists = getBoardString(n).match(/.{1,4}/g)
    if (lists) {
        for (let i=0; i < lists.length; i++) {
            lists[i] = lists[i].split('').join(' - ');
            lists[i] = i%2==0 ? '- ' + lists[i] : lists[i] + ' -';
        }
    }
    return lists;
}

//print the board in an understandable view
export function printBoard(white: number, black: number, king: number, print: boolean = true): string[] {

    const arr: string[] = Array(32).fill('-');

    let whiteMen = getBoardString(white ^ king).split('')
    for (let i=0; i < whiteMen.length; i++) {
        if (whiteMen[i] === '1') {
            arr[i] = 'w';
        }
    }

    let blackMen = getBoardString(black ^ king).split('')
    for (let i=0; i < blackMen.length; i++) {
        if (blackMen[i] === '1') {
            arr[i] = 'b';
        }
    }

    let whiteKing = getBoardString(white & king).split('')
    for (let i=0; i < whiteKing.length; i++) {
        if (whiteKing[i] === '1') {
            arr[i] = 'W';
        }
    }

    let blackKing = getBoardString(black & king).split('')
    for (let i=0; i < blackKing.length; i++) {
        if (blackKing[i] === '1') {
            arr[i] = 'B';
        }
    }

    let lists = arr.join('').match(/.{1,4}/g)
    if (lists) {
        for (let i=0; i < lists.length; i++) {
            lists[i] = lists[i].split('').join('   ');
            lists[i] = i%2==0 ? '  ' + lists[i] : lists[i] + '  ';
        }
    }

    if (print) console.log(lists);
    return lists!;
}

export function getRandom(arr: any[]): any {
    return arr[arr.length * Math.random() | 0];
}

export function randomNeg(minmax: number = 1) : number {
    return Math.random() * (Math.round(Math.random()) ? 1 : -1) * minmax;
}

export function getPieceCount(value: number): number {
    let count = 0;
    for (let index = 0; index < 32; index++) {
        const bit = value & (1 << index);
        if (bit) count += 1;
    }
    return count;
}

export function getAvrDist(value: number): number {
    let pieceCount = 0;
    let total = 0;
    for (let index = 0; index < 32; index++) {
        const bit = value & (1 << index);
        if (bit) {
            pieceCount += 1;
            total += Math.floor(index/4);
        }
    }
    if (pieceCount == 0) return 0;
    return total / pieceCount;
}

export function writeToFile(filename: string, data: any, newline: boolean = true) {
    const fs = require('fs');
    if (newline) data = `${data}\n`;
    fs.appendFileSync(filename, data);
}

export function roundTo(val: number, place: number = 0) {    
    return Math.round((val * (Math.pow(10, place)))) / (Math.pow(10, place));
}

export function getWeights(weightInit: WeightInit): BoardStats {
    switch (weightInit) {
        case WeightInit.RANDOM:
            return getRandomWeights();
        case WeightInit.RANDOMPOSITIVE:
            return getRandomPositiveWeights();
        case WeightInit.ZERO:
            return getInitBoardStats(0);
        case WeightInit.ONE:
            return getInitBoardStats(1);
        case WeightInit.POINTFIVE:
            return getInitBoardStats(0.5);
        case WeightInit.CAPTURE_PREFER:
            return getCapturePrefer();
        case WeightInit.TEST:
            return getTestWeights();
        case WeightInit.TRAINED:
            return getTrainedWeights();
        default:
            return getRandomWeights();
    }

}

export function getInitBoardStats(initialiser: number = 0): BoardStats {
    return {
        pieces: initialiser,
        kings: initialiser,
        avrDist: initialiser,
        backline: initialiser,
        corners: initialiser,
        edges: initialiser,
        centre2: initialiser,
        centre4: initialiser,
        centre8: initialiser,
        defended: initialiser,
        attacks: initialiser
    }
}

function getRandomWeights(): BoardStats {
    return {
        pieces: randomNeg(2),
        kings: randomNeg(2),
        avrDist: randomNeg(2),
        backline: randomNeg(2),
        corners: randomNeg(2),
        edges: randomNeg(2),
        centre2: randomNeg(2),
        centre4: randomNeg(2),
        centre8: randomNeg(2),
        defended: randomNeg(2),
        attacks: randomNeg(2)
    }
}

function getRandomPositiveWeights(): BoardStats {
    return {
        pieces: Math.random(),
        kings: Math.random(),
        avrDist: Math.random(),
        backline: Math.random(),
        corners: Math.random(),
        edges: Math.random(),
        centre2: Math.random(),
        centre4: Math.random(),
        centre8: Math.random(),
        defended: Math.random(),
        attacks: Math.random(),
    }
}

export function getCapturePrefer(): BoardStats {
    return {
        pieces: 1,
        kings: 1,
        avrDist: 0,
        backline: 0,
        corners: 0,
        edges: 0,
        centre2: 0,
        centre4: 0,
        centre8: 0,
        defended: 0,
        attacks: 0
    }
}

export function getTestWeights(): BoardStats {
    return {
        pieces: 2,
        kings: 0.5,
        avrDist: 0.1,
        backline: 0.1,
        corners: 0.1,
        edges: 0.1,
        centre2: 0.1,
        centre4: 0.1,
        centre8: 0.5,
        defended: 0.1,
        attacks: 0.1
    }
}

export function getTrainedWeights(): BoardStats {
    return {
        pieces: 1.9567,
        kings: 1.6984,
        avrDist: -1.764,
        backline: 0.887,
        corners: 0.918,
        edges: 1.055,
        centre2: -0.4836,
        centre4: 1.416,
        centre8: 0.5351,
        defended: -0.715,
        attacks: 0.0118
    }
}

export function getBestBoardDefault(): BoardStats {
    return {
        pieces: 11,
        kings: 11,
        avrDist: 7,
        backline: 4,
        corners: 2,
        edges: 12,
        centre2: 2,
        centre4: 4,
        centre8: 8,
        defended: 12,
        attacks: 12
    }
}

// generate a unique key from all piece locations
export function generateKeyComplete(white: number, black: number, king: number): string {
    return `${white}/${black}/${king}`;
}

// generate a unique key from the pieces of one colour
export function generateKey(value: number, king: number): string {
    return `${value}/${value & king}`;
}

// reverse the bits in a 32 bit int
export function reverseBits(x: number) {
    x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
    x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
    x = ((x >> 4) & 0x0F0F0F0F) | ((x & 0x0F0F0F0F) << 4);
    x = ((x >> 8) & 0x00FF00FF) | ((x & 0x00FF00FF) << 8);
    x = (x >>> 16) | (x << 16);

    return x >>> 0;
}


export function getKeyByValue(value: number, record: Record<number, number>): number | undefined {
    for (const key in record) {
        if (Math.abs(record[key]) === Math.abs(value)) {
            return parseInt(key);
        }
    }
    return undefined;
}

export function getTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const time = `${hours}_${minutes}_${seconds}: `;
    return time;
}

// generate the pairing of matches for a population
export function getPopulationMatches(popSize: number, competition: number = 0, matchCount: number = 10): number[][] {
    if (popSize < 2) return [];

    switch (competition) {
        case 0:
            return roundRobinMatches(popSize);
        case 1:
            return randomOppMatches(popSize, matchCount);
        default:
            return roundRobinMatches(popSize);
    }
}

// everyone plays everyone
export function roundRobinMatches(popSize: number): number[][] {
    return permutations([...Array(popSize).keys()],2);
}

// everyone plays matchCount random opponents
export function randomOppMatches(popSize: number, matchCount: number): number[][] {
    let matches: number[][] = [];

    let odd = false;
    let extra: number;

    if (popSize % 2 === 1) {
        odd = true;
        extra = 0
    }

    for (let i = 0; i < matchCount; i++) {
        let lst = [...Array(popSize).keys()];
        if (odd) {
            let r1 = popRandom(lst)!;
            let r2 = extra! % popSize;
            if (r1 === r2) {
                r2 = (r2 + 1) % popSize;
            }
            matches.push([r1, r2]);
            matches.push([r2, r1]);
            extra! += 1;
        }
        while (lst.length > 0) {
            let r1 = popRandom(lst)!;
            let r2 = popRandom(lst)!;
            matches.push([r1, r2]);
            matches.push([r2, r1]);
        }
    }

    return matches;
}


export function popRandom<T>(array: T[]): T | undefined {
    if (array.length === 0) {
      return undefined;
    }
    const index = Math.floor(Math.random() * array.length);
    return array.splice(index, 1)[0];
}


export function getStandardDeviation(numbers: number[]): number {
    // Calculate the mean of the numbers
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    
    // Calculate the sum of the squared differences from the mean
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const sumOfSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
    
    // Calculate the variance (the average of the squared differences)
    const variance = sumOfSquaredDiffs / numbers.length;
    
    // Calculate the standard deviation (the square root of the variance)
    const standardDeviation = Math.sqrt(variance);
    
    return standardDeviation;
}


export function permutations(arr: number[], len: number = arr.length): number[][] {
	
    len = len || arr.length;
    if(len > arr.length) len = arr.length;
    const results: any[] = [];
  
    function eliminate(el: number, arr: number[]) {
        let i = arr.indexOf(el);
        arr.splice(i, 1);
        return arr;
    }
  
    function perms(arr: number[], len: number, prefix: any[] = []) {
        if (prefix.length === len) {
            results.push(prefix);
        } else {
            for (let elem of arr) {
                let newPrefix = [...prefix];
                newPrefix.push(elem);
                let newRest = null;
                newRest = eliminate(elem, [...arr]);
                perms(newRest, len, newPrefix);
            }
        }
        return;
    }
    perms(arr, len);

    return results;
}


export function weightedRandom(values: any[], weights: number[], n: number): any[] {
    if (values.length !== weights.length) {
        throw new Error('Values and weights arrays must be of equal length.');
    }

    if (weights.reduce((a, b) => a + b, 0) == 0) {
        // All weights are 0, so return values with equal probability
        weights = weights.map(() => 1);
    }
  
    const weightedValues: [any, number][] = values.map((value, index) => [value, weights[index]]);
    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const result: any[] = [];
  
    while (n > 0 && weightedValues.length > 0) {
        let rand = Math.random() * totalWeight;
        let i = 0;
    
        while (rand > 0 && i < weightedValues.length) {
            rand -= weightedValues[i][1];
            i++;
        }
    
        i--;

        result.push(weightedValues[i][0]);
        
        totalWeight -= weightedValues[i][1];
        weightedValues.splice(i, 1);
        n--;
    }
  
    return result;
}


export function checkDraw(boardStack: number[][], nonManMoves: number): number {
    //check for draw by 40 move rule
    if (nonManMoves >= 40) return Status.DRAW_40;

    //check for draw by repetition
    if (boardStack.length > 8) {
        if (areListsEqual(boardStack[boardStack.length-1], boardStack[boardStack.length-5], boardStack[boardStack.length-9])) {
            return Status.DRAW_REPETITION;
        }
    }
    return Status.PLAYING;   
}

export function areListsEqual(list1: number[], list2: number[], list3: number[]): boolean {
    if (list1.length !== list2.length || list1.length !== list3.length) {
        return false;
    }
    for (let i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[i] || list1[i] !== list3[i]) {
            return false;
        }
    }
    return true;
}

export function generateInitialPopulation(size: number, weightInit?: WeightInit): Map<number, WeightSet> {//PopulationSet {
    let population: Map<number, WeightSet> = new Map();
    if (weightInit === undefined) weightInit = WeightInit.RANDOM;
    for (let i = 0; i < size; i++) {
        population.set(i, {
            'weights': getWeights(weightInit),
            'score': 0,
            'evaluationDB': {},
        });
    }
    return population;
}

export function moveToMoveString(move: Move): string {
    let captures = ''
    if (move.captures) {
        let c = getPresentBitIndexes(move.captures).reverse().map(bit => 32-bit)
        captures = ` (${c.join(',')})`
    }
    const s = 32 - (getPresentBitIndexes(move.start)[0])
    const e = 32 - (getPresentBitIndexes(move.end)[0])
    const moveString = `${s}-${e}${captures}`
    return moveString
}


export function generateResultsTable(results: Result[], bots: string[], scores: Map<number, number>) {

    console.log('generating results table')

    const table: (string | number)[][] = []
    const headers: string[] = ['-', ...bots, 'score']
    table.push(headers);

    for (let i=0; i<bots.length; i++) {
        const row: (string | number)[] = [bots[i]];

        for (let j=0; j<bots.length; j++) {
            if (i === j) {
                row.push(0);
            } else {
                let r: Map<number, Result> = new Map();
                for (const obj of results) {
                    if (obj.white == +bots[i] && obj.black == +bots[j]) r.set(1,obj);
                    if (obj.white == +bots[j] && obj.black == +bots[i]) r.set(2,obj);
                }
                let res: string;
                let r1 = r.get(1)!.result;
                let r2 = r.get(2)!.result;
                r1 > 2 ? res  = "D": r.get(1)!.result == 1 ? res  = "W": res  = "L";
                r2 > 2 ? res += "D": r.get(2)!.result == 1 ? res += "L": res += "W";
                row.push(res);
            }
        }
        row.push(scores.get(+bots[i])!);
        row.push()
        table.push(row);
    }
    return table;
}


export async function loadPopFromJSON(filename: string = '../inputGen.json'): Promise<any> {
    let moduleName: string = filename;
    let importedJSON = await importModule(moduleName);
    return await importedJSON['population'];
}

async function importModule(moduleName: string): Promise<any> {
    console.log("importing ", moduleName);
    const importedModule = await import(moduleName);
    return importedModule.default;
}



