import { Checkers } from './src/checkers';
import { printBoard, getBoardString } from './src/helper';

// Initialise the board
let checkers = new Checkers();

// Play 10 moves
for (let index = 0; index < 10; index++) {
    console.log(checkers.player)
    console.log(`Turn ${index + 1}: ${checkers.player === 0 ? 'White' : 'Black'}`);
    let moves = checkers.getMoves();
    for (let i = 0; i < moves.length; i++) {
        console.log(`Possible Move ${i + 1}: ${getBoardString(moves[i].start)} -> ${getBoardString(moves[i].end)} [${moves[i].captures}]`);
    }
    checkers = checkers.makeMove(moves[0]);
    console.log(`Move ${index + 1}:`)
    printBoard(checkers.board);
}

// Show the bitboard result
const { white, black, king } = checkers.board;
console.table({ white, black, king });
printBoard(checkers.board);

// TODO: fix issue with no moves available on move 4