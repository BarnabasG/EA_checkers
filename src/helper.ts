import { minimax } from "./ai";
import { Board } from "./board";
import { Checkers } from "./checkers";
import { Player, Status } from "./types";


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
    let checkers = new Checkers();
    let status = 0;
    let index = 0;

    while (index <= moveLimit) {
        let moves = checkers.getMoves();
        status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
        if (status !== 0) {
            console.log('Game Over', index, status, Status[status]);
            return status;
        }
        checkers = checkers.makeMove(getRandom(moves));
        index++;
    }
    console.log('Game Over (move limit reached)', index, status, Status[status]);
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
    let checkers = new Checkers();
    let status = 0;
    let index = 0;

    while (index <= moveLimit) {
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
    console.log('Game Over (move limit reached)', index, status, Status[status]);
    return status;
}

export function getAvrDist(value: number, player: Player): number {
    let pieceCount = 0;
    let total = 0;
    for (let index = 0; index < 32; index++) {
        const bit = value & (1 << index);
        if (bit) {
            pieceCount += 1;
            total += Math.floor(index/4);
        }
    }
    return player === Player.WHITE ? total/pieceCount : 7 - total/pieceCount;
}


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