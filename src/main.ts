//import { Checkers } from './checkers';
//import { printBoard, getRandom, getBoardFomBin, getBoardString, randomGame } from './helper';
//import { Player, Status } from './types';

import { minimaxGame, randomGame } from './helper';

let moveLimit: number = 100;
let games: number = 1;
let results: number[] = [];

for (let i=0; i < games; i++) {
    //results.push(randomGame(moveLimit));
    results.push(minimaxGame(moveLimit));
}

console.log(results);


/*
let checkers = new Checkers();

//let status = checkers.getStatus();
let status = 0;
let index = 0;
console.log(status);
printBoard(checkers.board);
//while (status === 0) {
while (index <= 100) {
    //console.log(`Turn ${index + 1}: ${checkers.player === 0 ? 'White' : 'Black'}`);
    let moves = checkers.getMoves();
    //console.log(moves);
    status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
    if (status !== 0) {
        console.log('Game Over', index, status, Status[status]);
        break;
    }
    //for (let i = 0; i < moves.length; i++) {
    //    console.log(`Possible Move ${i + 1}: ${getBoardString(moves[i].start)} -> ${getBoardString(moves[i].end)} [${moves[i].captures}]`);
    //}
    let m = getRandom(moves);
    checkers = checkers.makeMove(m);
    //checkers = checkers.makeMove(getRandom(moves));
    //checkers = checkers.makeMove(moves[0]);
    //printBoard(checkers.board);
    //if (m.start < 0 || m.end < 0) {
    //    console.log('negative move', m, getBoardFomBin(m.start), getBoardFomBin(m.end), getBoardFomBin(m.captures));
    //}
    //console.log(getBoardFomBin(checkers.board.king));
    //console.log('1------------------------------------')
    //status = checkers.status;
    //console.log('2------------------------------------')
    index++;
    //console.log('3------------------------------------')
    //if (index > 100) {
    //    console.log('too many turns');
    //    break;
    //}
}
//printBoard(checkers.board);
console.log(status);
*/

