import { Board } from "./board";


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

export function printBoardNum(n: number | string) {

    let lists = getBoardString(n).match(/.{1,4}/g)

    if (lists) {
        for (let i=0; i < lists.length; i++) {
            lists[i] = lists[i].split('').join(' - ');
            lists[i] = i%2==0 ? '- ' + lists[i] : lists[i] + ' -';
        }
    }

    return lists;
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