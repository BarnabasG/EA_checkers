//import { minimax, evaluateBoard } from "./ai";
//import { Board } from "./board";
//import { Checkers } from "./checkers";
//import {  } from "./bloomDatabase";
import { BoardStats, Status, Result, WeightSet, WeightInit, BloomHashMapBoardStats, Player } from "./types";

//let s1 = performance.now();
//import boardDB from '../boardDB_6.json';
//import boardDB from '../positionStatDB.json';
//console.log('JSON loaded in', performance.now() - s1, 'ms')


//import boardDB from '../positionStatDB.json';



//console.log(boardDB)

//export var boardStatsDatabase: BoardDatabase = {};
export var boardStatsDatabase: BloomHashMapBoardStats = new BloomHashMapBoardStats();

export function clearBoardDB() {
    boardStatsDatabase = new BloomHashMapBoardStats();
}



/*console.log('Reading board database json')
let s = performance.now();
try {
    boardStatsDatabase = boardDB;
} catch (e) {
    console.log('error', e, 'failed to read boardDB.json');
    boardStatsDatabase = {};
}

console.log('Board database json read', performance.now() - s, 'ms')
console.log('saved layouts', Object.keys(boardStatsDatabase).length);*/

/*
export function getBoardStatsDatabase() {
    console.log('Reading board database json')
    let s = performance.now();
    export var boardStatsDatabase: BoardDatabase = boardDB;
    console.log('Board database json read', performance.now() - s, 'ms')
    console.log('saved layouts', Object.keys(boardStatsDatabase).length);
}*/

//console.log('length before', Object.keys(boardStatsDatabase).length);
//console.log(boardStatsDatabase);


/*export function getBoardStatsDatabase() {
    console.log('getBoardStatsDatabase');
    var fs = require('fs');
    fs.readFile('boardDB.json', 'utf8', function readFileCallback(err: any, data: string) {
        if (err){
            console.log('err', err);
        } else {
            console.log('data (get function)', data);
            console.trace();
            boardStatsDatabase = JSON.parse(data);
            //obj.table.push({id: 2, square:3}); //add some data
            //json = JSON.stringify(obj); //convert it back to json
            //fs.writeFile('boardDB.json', json, 'utf8', callback); // write it back 
        }
    });
    console.log('before', boardStatsDatabase);
    return boardStatsDatabase;
}*/

/*export function saveBoardStatsDatabase(database: BoardDatabase = undefined, filename: string = 'boardDB.json') {
    console.log('saveBoardStatsDatabase');
    var fs = require('fs');
    let db = database == undefined ? boardStatsDatabase: database;
    let json = JSON.stringify(db);
    //fs.writeFile('positionStatDB.json', json, 'utf8', function (err: any) { if (err) throw err; console.log('complete'); });
    fs.writeFile(filename, json, 'utf8', function (err: any) { if (err) throw err; console.log('complete'); });
    console.log('saved layouts after', Object.keys(db).length);
}*/

export function decToBin(dec: number) {
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

export function getBoardFomBin(n: number | string) {

    let lists = getBoardString(n).match(/.{1,4}/g)
    if (lists) {
        for (let i=0; i < lists.length; i++) {
            lists[i] = lists[i].split('').join(' - ');
            lists[i] = i%2==0 ? '- ' + lists[i] : lists[i] + ' -';
        }
    }

    return lists;
}

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


/*export function reduceCaptures(moves: any[]) {
    let reduced = 0;
    for (let i=0; i < moves.length; i++) {
        reduced += moves[i].captures;
    }
    return reduced;
}*/


export function getPieceCount(value: number): number {
    let count = 0;
  
    for (let index = 0; index < 32; index++) {
        const bit = value & (1 << index);
        if (bit) count += 1;
    }
  
    return count;
}

export function getAvrDistPlayer(value: number, player: Player): number {
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
    return player === Player.WHITE ? total / pieceCount : 7 - (total / pieceCount);
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

    /*fs.appendFile(filename, data, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });*/

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

export function getBestBoardDefault(): BoardStats {
    return {
        pieces: 12,
        kings: 12,
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

export function generateKeyComplete(white: number, black: number, king: number): string {
    return `${white}/${black}/${king}`;
    /*let key = '';
    for (let index = 0; index < 32; index++) {
        let bitWhite = white & (1 << index)
        let bitBlack = black & (1 << index)
        let bitKing = king & (1 << index)
        if (bitWhite) {
            if (bitKing) {
                key += 'W';
            } else {
                key += 'w'; 
            }
        } else if (bitBlack) {
            if (bitKing) {
                key += 'B';
            } else {
                key += 'b'; 
            }
        } else {
            key += '0';
        }
    }*/

    // compress key with run length encoding (RLE) (optional - performance hit for compression)
    //key = key.replace(/([ \w])\1+/g, (group, chr) => group.length + chr);

    //return key;
}

export function generateKey(value: number, king: number): string {
    return `${value}/${value & king}`;
    //let key = '';
    //for (let index = 0; index < 32; index++) {
    //    let bitPiece = value & (1 << index)
    //    let bitKing = king & (1 << index)
    //    key += bitPiece ? bitKing ? 'K' : 'P' : '0';
    //}

    //console.log('key1', key)

    // compress key with run length encoding (RLE)
    //key = key.replace(/([ \w])\1+/g, (group, chr) => group.length + chr);

    //console.log('key2', key)

    //return key;
}

/*export function generateKeyNumber(value: number, king: number, flipBit: 0 | 1): number {
    const mask = 0xFFFFFFFF - ((1 << 16) - 1); // create a mask that zeroes out the least significant 16 bits
    const uniqueKey = (value & mask) | (king & 0xFFFF);
    return flipBit === 1 ? uniqueKey ^ 1 : uniqueKey;
}*/

export function generateKeyNumber(value: number, king: number): number {
    const mask = 0xFFFFFFFF - ((1 << 16) - 1); // create a mask that zeroes out the least significant 16 bits
    const uniqueKey = (value & mask) | (king & 0xFFFF);
    return uniqueKey
}

export function reverseBits1(num: number): number {
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = (result << 1) | (num & 1);
        num >>>= 1;
    }
    return result << 16 | result >>> 16;
}

export function reverseBits(x: number) {
    x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
    x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
    x = ((x >> 4) & 0x0F0F0F0F) | ((x & 0x0F0F0F0F) << 4);
    x = ((x >> 8) & 0x00FF00FF) | ((x & 0x00FF00FF) << 8);
    x = (x >>> 16) | (x << 16);

    return x >>> 0;
}



export function getPopulationMatches(popSize: number, competition: number = 0, matchCount: number = 10): number[][] {
    //if (competition === 0) {
    //return permutations([...Array(popSize).keys()],2);
    //}

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


export function roundRobinMatches(popSize: number): number[][] {
    return permutations([...Array(popSize).keys()],2);
}


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





function popRandom<T>(array: T[]): T | undefined {
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

    //console.log('values', values)
    //console.log('weights', weights)
    //console.log('n', n)

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


/*export function checkDraw(boardStack: number[][], nonManMoves: number): boolean {
    //check for draw by 40 move rule
    if (nonManMoves >= 40) return true;

    //check for draw by repetition
    if (boardStack.length > 4) {
        if (boardStack.at(-1) === boardStack.at(-3) && boardStack.at(-3) === boardStack.at(-5)) {
            console.log('draw by repetition')
            console.log(boardStack[-1], boardStack[-3], boardStack[-5])
            return true;
        }
    }
    return false;   
}*/

export function checkDraw(boardStack: number[][], nonManMoves: number): number {
    //check for draw by 40 move rule
    if (nonManMoves >= 40) return Status.DRAW_40;

    //check for draw by repetition
    if (boardStack.length > 4) {
        if (areListsEqual(boardStack[boardStack.length-1], boardStack[boardStack.length-3], boardStack[boardStack.length-5])) {
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
    //let population: PopulationSet = {};
    let population: Map<number, WeightSet> = new Map();
    if (weightInit === undefined) weightInit = WeightInit.RANDOM;
    //const weights = getInitBoardStats(1);
    for (let i = 0; i < size; i++) {
        population.set(i, {
            //'weights': weights,
            'weights': getWeights(weightInit),//getRandomWeights(),
            'score': 0,
            //'evaluationDB': new BloomHashMapEvalData(),
            'evaluationDB': {},
        });
    }
    return population;
}

export function getRandomSample<T>(arr: T[], sampleSize: number): T[] {
    const sample: T[] = [];
    const copiedArray = [...arr]; // create a copy of the original array
  
    while (sample.length < sampleSize && copiedArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * copiedArray.length);
      sample.push(copiedArray[randomIndex]);
      copiedArray.splice(randomIndex, 1); // remove the selected element from the copied array
    }
  
    return sample;
}

//export function generateResultsTable(results: Map<string, Result>, bots: string[]) {
export function generateResultsTable(results: Result[], bots: string[], scores: Map<number, number>) {

    console.log('generating results table')
    console.log(results)
    console.log(bots)

    const table: (string | number)[][] = [] //createZeroMatrix(bots.length, -2);
    //console.log(table)

    //console.log(results.array.forEach(element => {
    //    element.white
    //});
    
    const headers: string[] = ['-', ...bots, 'score']// ["", ...results.map((bot) => bot.white.toString())];

    // Set the first row of the table to be the headers
    table.push(headers);
    console.log(table)

    //for (let i=0; i<bots.length, i++) {
    //    table
    //}

    // Fill in the remaining rows of the table

    //for (const res in results.keys()) {

    //}

    
    //for (const i in bots) {


    //TODO rethink table layout

    for (let i=0; i<bots.length; i++) {
        // Create a new row with the bot name as the first element
        const row: (string | number)[] = [bots[i]];
        //console.log(i)
        //console.log(i, bots)

        //for (const j in bots) {
        for (let j=0; j<bots.length; j++) {
            //console.log(bots[i], bots[j])
            if (i === j) {
                row.push(0); // Bot cannot play against itself
            } else {
                // Simulate a game between bots i and j
                //const result = simulateGame(bots[i], bots[j]);
                //const result = results.get(i.concat(",",j));
                let r: Map<number, Result> = new Map();
                for (const obj of results) {
                    if (obj.white == +bots[i] && obj.black == +bots[j]) r.set(1,obj);
                    if (obj.white == +bots[j] && obj.black == +bots[i]) r.set(2,obj);
                }
                //console.log(r)
                let res: string;
                let r1 = r.get(1)!.result;
                let r2 = r.get(2)!.result;
                r1 > 2 ? res  = "D": r.get(1)!.result == 1 ? res  = "W": res  = "L";
                r2 > 2 ? res += "D": r.get(2)!.result == 1 ? res += "L": res += "W";
                //console.log('res',res)

                // Add the result to the row
                //row.push(result.result);
                row.push(res);
            }
        }/**/
        row.push(scores.get(+bots[i])!);
        row.push()
        // Add the row to the table
        table.push(row);
    }
    
    // Print the table
    //console.log(table)
    //console.table(table);

    return table;
}


/*

- 1 2 3
1 0 2 3
2 2 0 3
3 3 3 0

- 1 2 3
1 0 2 3
2 2 0 3
3 3 3 0



*/

/*function getLastLine(filename: string): string {

    const fs = require('fs');
    const readline = require('readline');

    //const filename = 'example.txt';

    const readInterface = readline.createInterface({
        input: fs.createReadStream(filename),
        console: false
    });

    let lastLine: string = '';

    readInterface.on('line', (line: string) => {
        lastLine = line;
    });

    readInterface.on('close', () => {
        console.log(lastLine);
    });

    return lastLine;
}*/

//export async function loadLatestPopFromJSON(filename: string = '../inputGen.json'): Promise<any> {
    //let moduleName: string = filename;
    //let importedJSON = await importModule(moduleName);
    //return await importedJSON['population'];
//}

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


//console.log(getBoardFomBin(2073))

/*export function getFiles(directory: string) {
    const fs = require('fs');
    const directoryPath = directory;

    fs.readdir(directoryPath, (err: any, files: string[]) => {
        if (err) {
            console.error('Error getting directory content:', err);
            return;
        }
        
        console.log('List of files:');
        files.forEach(file => {
            console.log(file);
        });
    })
}*/

/*export function getFiles(directoryPath: string): Promise<string[]> {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err: any, files: string[] | PromiseLike<string[]>) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}*/

/*export function getLastFilenameInDirectory(directoryPath: string): Promise<string> {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err: any, files: string | any[]) => {
            if (err) {
                reject(err);
            } else {
                const lastFilename = files[files.length - 1];
                resolve(lastFilename);
            }
        });
    });
  }*/
  

//getFiles('../');


/*async function exampleUsage() {
    const directoryPath = './generation_log';
    try {
        const filenames = await getFiles(directoryPath);
        console.log('List of filenames:', filenames);
        return filenames;
    } catch (err) {
        console.error('Error getting directory content:', err);
    }
}*/
  
//const f = exampleUsage();
//console.log('files', f)
  
//const files = await getFiles('./generation_log');
//console.log('files', files)
//const latest = files![files!.length - 1];
//console.log('latest', latest)
//getLastLine(latest);


//getFiles('./generation_log');


//loadPopFromJSON().then((x) => {
//    console.log("Resolved value: ", x);
//}).catch((err) => {
//    console.log("Error: ", err);
//});



/*
export function listToPopulationSet(list: any[]): PopulationSet {
    let populationSet: PopulationSet = {
        population: [],
        weights: []
    }
    for (let item of list) {
        populationSet.population.push(item);
        populationSet.weights.push(1);
    }
    return populationSet;
}*/



/*import { Checkers } from "./checkers";
let checkers = new Checkers();
console.log(checkers.population)
console.log('---')
console.log(checkers.population.population)
console.log('---')
console.log(checkers.population.population[0])
console.log('---')
console.log(checkers.population.population[0]['weights'])*/


/*export function boardLookup(board: Board): BoardStats | undefined {
    let key = getBoardString(board.white) + getBoardString(board.black) + getBoardString(board.king);
    console.log(key)
    if (boardStatsDatabase[key]) {
        return boardStatsDatabase[key];
    }
    return undefined;
}*/


//export function getBackline(value: number, player: Player): number {
//    return player === Player.WHITE ? getPieceCount(value & KINGROW_BLACK) : getPieceCount(value & KINGROW_WHITE);
//}

//export function getEdges(value: number): number {
//    return getPieceCount(value & EDGES);
//}

//export function getCentre2(value: number): number {
//    return getPieceCount(value & CENTRE2);
//}




/*let value = 0b1010_1001_0110_0000_0000_0000_1001_0001;
console.log(getAvrDist(value, Player.WHITE))
console.log(getAvrDist(value, Player.BLACK))
console.log(getBackline(value, Player.WHITE))
console.log(getBackline(value, Player.BLACK))
console.log(getEdges(value))*/

//console.log(roundTo(1.23456789, 2))

//randomOppMatches(11, 3)