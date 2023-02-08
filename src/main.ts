import { Checkers } from './checkers';
import { printBoard, getRandom, getBoardFomBin } from './helper';

let checkers = new Checkers();

let status = checkers.getStatus();
let index = 0;
console.log(status);
printBoard(checkers.board);
while (status === 0) {
    console.log(`Turn ${index + 1}: ${checkers.player === 0 ? 'White' : 'Black'}`);
    let moves = checkers.getMoves();
    checkers = checkers.makeMove(getRandom(moves));
    printBoard(checkers.board);
    console.log(getBoardFomBin(checkers.board.king));
    status = checkers.getStatus();
    index++;
}
//printBoard(checkers.board);
console.log(status);


