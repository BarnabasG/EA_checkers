//import { minimax, evaluateBoard } from "./ai";
//import { Board } from "./board";
//import { Checkers } from "./checkers";
import { BoardStats, Player, Status, BoardDatabase, TrainingPatterns, Pattern, Move } from "./types";

//let s1 = performance.now();
//import boardDB from '../boardDB_6.json';
//import boardDB from '../positionStatDB.json';
//console.log('JSON loaded in', performance.now() - s1, 'ms')


//import boardDB from '../positionStatDB.json';



//console.log(boardDB)

export var boardStatsDatabase: BoardDatabase = {};


export const STANDARD_TRAINING_PATTERNS: TrainingPatterns = {
    //Round Robin
    'RR': {
        0:  {depth:2, populationSize:50}, //[2, 50], //2450 
        1:  {depth:3, populationSize:40}, //[3, 40], //1560
        2:  {depth:4, populationSize:25}, //[4, 25], //870
        3:  {depth:4, populationSize:20}, //[4, 20], //380
        4:  {depth:4, populationSize:20}, //[4, 20],
        5:  {depth:5, populationSize:20}, //[5, 20],
        6:  {depth:5, populationSize:20}, //[5, 20],
        7:  {depth:5, populationSize:20}, //[5, 20],
        8:  {depth:6, populationSize:20}, //[6, 20],
        9:  {depth:6, populationSize:20}, //[6, 20],
        10: {depth:7, populationSize:20} //[7, 20]
    },
    //Random Opponents
    'RO': {
        0:  {depth:2, populationSize:50, matchCount:15}, //[2, 200, 15], //3000
        1:  {depth:3, populationSize:40, matchCount:10}, //[3, 150, 10], //2000
        2:  {depth:4, populationSize:25, matchCount:10}, //[4, 100, 10], //1500
        3:  {depth:4, populationSize:20, matchCount:10}, //[4, 100, 10], //1500
        4:  {depth:4, populationSize:20, matchCount:10}, //[4, 100, 10], //1500
        5:  {depth:5, populationSize:20, matchCount:10}, //[5, 50, 10], //1000
        6:  {depth:5, populationSize:20, matchCount:10}, //[5, 50, 10],
        7:  {depth:5, populationSize:20, matchCount:10}, //[5, 50, 10],
        8:  {depth:6, populationSize:20, matchCount:10}, //[6, 50, 10],
        9:  {depth:6, populationSize:20, matchCount:10}, //[6, 50, 10],
        10: {depth:7, populationSize:20, matchCount:10}  //[7, 50, 10]
    }
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

export function pad(n: string, width=32, z=0) {
    return (String(z).repeat(width) + String(n)).slice(String(n).length)
}

export function getBoardString(n: number | string) {
    if (typeof n === 'string') {
        n = parseInt(n, 2);
    }
    return pad(decToBin(n));
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

export function getPresentBits(value: number): number[] {

    const bitArr: number[] = [];

    for (let index = 0; index < 32; index++) {
      let bit = value & (1 << index);
      if (bit) bitArr.push(bit);
    }
  
    return bitArr;
}


export function printBoard(white: number, black: number, king: number) {

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

    console.log(lists);
    return;
}

export function getRandom(arr: any[]) {
    return arr[arr.length * Math.random() | 0];
}

export function randomNeg() {
    return Math.random() * (Math.round(Math.random()) ? 1 : -1)
}


export function reduceCaptures(moves: any[]) {
    let reduced = 0;
    //console.log(moves)
    for (let i=0; i < moves.length; i++) {
        reduced += moves[i].captures;
    }
    //console.log(reduced)
    //console.log('reduced captures', getBoardFomBin(reduced))
    return reduced;
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
    return total/pieceCount;
}

export function roundTo(n: number, place: number) {    
    return Math.round((n * (Math.pow(10, place)))) / (Math.pow(10, place));
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

export function getCapturePreferer(): BoardStats {
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

/*export function generateKey2(white: number, black: number, king: number): string {
    let key = '';
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
    }

    //console.log('key1', key)

    // compress key with run length encoding (RLE)
    key = key.replace(/([ \w])\1+/g, (group, chr) => group.length + chr);

    //console.log('key2', key)

    return key;
}

export function generateKey1(white: number, black: number, king: number): string {
    
    //a database key based on the state of the board (white, black, king)
    let key = '';
    key += white + '/' + black + '/' + king;

    return key;
}*/

export function generateKey(value: number, king: number): string {
    let key = '';
    for (let index = 0; index < 32; index++) {
        let bitPiece = value & (1 << index)
        let bitKing = king & (1 << index)
        key += bitPiece ? bitKing ? 'K' : 'P' : '0';
    }

    //console.log('key1', key)

    // compress key with run length encoding (RLE)
    //key = key.replace(/([ \w])\1+/g, (group, chr) => group.length + chr);

    //console.log('key2', key)

    return key;
}


export function getPopulationMatches(popSize: number, competition: number = 0): number[][] {
    //if (competition === 0) {
    return permutations([...Array(popSize).keys()],2);
    //}
}

function permutations(arr: number[], len: number = arr.length): number[][] {
	
    len = len || arr.length;
    if(len > arr.length) len = arr.length;
    const results = [];
  
    function eliminate(el: number, arr: number[]) {
        let i = arr.indexOf(el);
        arr.splice(i, 1);
        return arr;
    }
  
    function perms(arr: number[], len: number, prefix = []) {
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


export function checkDraw(boardStack: number[][], nonManMoves: number): boolean {
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
}

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

//console.log(1/1)
//console.log(1/0)
//console.log(0/1)
//console.log(0/0)