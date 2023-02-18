import { minimax, evaluateBoard } from "./ai";
import { Board } from "./board";
import { Checkers } from "./checkers";
import { BoardStats, Player, Status, BoardDatabase } from "./types";
import boardDB from '../boardDB.json';


console.log(boardDB)



export var boardStatsDatabase: BoardDatabase = boardDB;
console.log('length before', Object.keys(boardStatsDatabase).length);
console.log(boardStatsDatabase);


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

export function saveBoardStatsDatabase() {
    console.log('saveBoardStatsDatabase');
    var fsSave = require('fs');
    let json = JSON.stringify(boardStatsDatabase);
    fsSave.writeFile('boardDB.json', json, 'utf8', function (err: any) { if (err) throw err; console.log('complete'); });
    console.log('after', boardStatsDatabase);
}

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

export function printBoard(board: Board) {

    const arr: string[] = Array(32).fill('-');

    let whiteMen = getBoardString(board.white ^ board.king).split('')
    for (let i=0; i < whiteMen.length; i++) {
        if (whiteMen[i] === '1') {
            arr[i] = 'w';
        }
    }

    let blackMen = getBoardString(board.black ^ board.king).split('')
    for (let i=0; i < blackMen.length; i++) {
        if (blackMen[i] === '1') {
            arr[i] = 'b';
        }
    }

    let whiteKing = getBoardString(board.white & board.king).split('')
    for (let i=0; i < whiteKing.length; i++) {
        if (whiteKing[i] === '1') {
            arr[i] = 'W';
        }
    }

    let blackKing = getBoardString(board.black & board.king).split('')
    for (let i=0; i < blackKing.length; i++) {
        if (blackKing[i] === '1') {
            arr[i] = 'B';
        }
    }

    let lists = arr.join('').match(/.{1,4}/g)
    if (lists) {
        for (let i=0; i < lists.length; i++) {
            lists[i] = lists[i].split('').join('   ');
            //lists[i] = i%2==0 ? '- ' + lists[i] : lists[i] + ' -';
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

//  { start: -2147483648, end: -134217728, captures: 0 },
//{ start: -2147483648, end: -67108864, captures: 0 }

/*console.log(decToBin(-2147483648))
console.log(decToBin(2147483648))
console.log(decToBin(-134217728))
console.log(decToBin(-67108864))
console.log(getBoardFomBin(-67108864))
console.log(getBoardFomBin(67108864))*/

// TODO: issue is with square 31 (top left) being -2147483648 in binary rather than 2147483648
// This is find until shhift also returns a negative number

export function randomGame(moveLimit: number = 100) {
    //boardStatsDatabase = getBoardStatsDatabase();
    let checkers = new Checkers();
    let status = 0;
    let index = 0;

    printBoard(checkers.board);
    console.log(checkers.board.getBoardStats())

    while (index <= moveLimit) {
        //checkers.bestBoard = checkers.updateBoardStats();
        let moves = checkers.getMoves();
        status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
        if (status !== 0) {
            console.log('Game Over', index, status, Status[status]);
            return status;
        }
        checkers = checkers.makeMove(getRandom(moves));
        console.log('Move', index, checkers.player, Status[status]);
        index++;
        printBoard(checkers.board);
        console.log(checkers.board.getBoardStats())
        console.log('eval', evaluateBoard(checkers))
    }
    console.log('Game Over (move limit reached)', index, status, Status[status]);
    saveBoardStatsDatabase();
    return status;
}

export function getPieceCount(value: number): number {
    let count = 0;
  
    for (let index = 0; index < 32; index++) {
        const bit = value & (1 << index);
        if (bit) count += 1;
    }
  
    return count;
}

export function minimaxGame(moveLimit: number = 100) {
    //boardStatsDatabase = getBoardStatsDatabase();
    let checkers = new Checkers();
    let status = 0;
    let index = 0;

    while (index <= moveLimit) {
        //checkers.bestBoard = checkers.updateBoardStats();
        let moves = checkers.getMoves();
        status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
        if (status !== 0) {
            console.log('Game Over', index, status, Status[status]);
            return status;
        }
        let move = minimax(checkers, 3);
        //console.log(move)
        checkers = checkers.makeMove(move);
        index++;
    }
    //console.log('Game Over (move limit reached)', index, status, Status[status]);
    saveBoardStatsDatabase();
    return status;
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

//export function randomiseBoardStats(stats: BoardStats): BoardStats {
//    for (let key in stats) stats[key] = randomNeg();
//    return stats
//}

export function generateKey(white: number, black: number, king: number): string {
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

export function compete(index1: number, index2: number) {
    


}





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