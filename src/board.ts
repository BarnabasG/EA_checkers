import { Move } from './types';

import { printBoard, printBoardNum, getPresentBits } from './helper';

const BIN: Record<number, number> = [];
BIN[0] = 1;
for (let i=1; i<32; i++) {
    BIN[i] = BIN[i-1] * 2;
}

console.log(BIN);

const WHITE_INIT = 0b0000_0000_0000_0000_0000_1111_1111_1111;
const BLACK_INIT = 0b1111_1111_1111_0000_0000_0000_0000_0000;
const KING_INIT = 0b0000_0000_0000_0000_0000_0000_0000_0000;

// Pieces able to  make a shift left 3 (UP LEFT)
const LEFT3 = BIN[1] | BIN[2] | BIN[3] | BIN[9] | BIN[10] | BIN[11] | BIN[17] | BIN[18] | BIN[19] | BIN[25] | BIN[26] | BIN[27];

// Pieces able to  make a shift left 5 (UP RIGHT)
const LEFT5 = BIN[4] | BIN[5] | BIN[6] | BIN[12] | BIN[13] | BIN[14] | BIN[20] | BIN[21] | BIN[22];

// Pieces able to  make a shift right 3 (DOWN RIGHT)
const RIGHT3 = BIN[4] | BIN[5] | BIN[6] | BIN[12] | BIN[13] | BIN[14] | BIN[20] | BIN[21] | BIN[22] | BIN[28] | BIN[29] | BIN[30];

//const RIGHT4 

// Pieces able to  make a shift right 5 (DOWN LEFT)
const RIGHT5 = BIN[9] | BIN[10] | BIN[11] | BIN[17] | BIN[18] | BIN[19] | BIN[25] | BIN[26] | BIN[27];

const KINGROW_WHITE = BIN[28] | BIN[29] | BIN[30] | BIN[31];

const KINGROW_BLACK = BIN[0] | BIN[1] | BIN[2] | BIN[3];

const CORNERS = BIN[0] | BIN[3] | BIN[28] | BIN[31];

const CENTRE4 = BIN[13] | BIN[18];

const CENTRE16 = BIN[9] | BIN[10] | BIN[13] | BIN[14] | BIN[17] | BIN[18] | BIN[21] | BIN[22];



export class Board {

    readonly white: number;
    readonly black: number;
    readonly king: number;

    private readonly empty: number;
    private readonly whiteKing: number;
    private readonly blackKing: number;

    constructor(white = WHITE_INIT, black = BLACK_INIT, king = KING_INIT) {
        this.white = white;
        this.black = black;
        this.king = king;

        this.empty = ~(this.white | this.black);
        this.whiteKing = this.white & this.king;
        this.blackKing = this.black & this.king;
    }

    makeMoveWhite(move: Move): Board {
        const isKing = move.start & this.king;
        // XOR white and move.start to set the white piece to 0 
        //console.log('white 1', printBoard(this));
        //console.log('move.start', printBoardNum(move.start));
        let white = this.white ^ move.start;
        //console.log('white 2', printBoard(this));

        //console.log('king 1', printBoard(this.king));
        //console.log('isKing', printBoard(isKing));
        let king = this.king ^ isKing;

        const black = this.black ^ move.captures;
        king ^= move.captures & this.king;

        //console.log('white 3', printBoard(this));
        white |= move.end;
        king |= king ? move.end : move.end & KINGROW_WHITE;

        //console.log('white 4', printBoard(this));

        return new Board(white, black, king);
    }

    makeMoveBlack(move: Move): Board {
        const isKing = move.start & this.king;
        let black = this.black ^ move.start;
        let king = this.king ^ isKing;

        const white = this.white ^ move.captures;
        king ^= move.captures & this.king;

        black |= move.end;
        king |= king ? move.end : move.end & KINGROW_BLACK;

        return new Board(white, black, king);
    }

    getMovablePiecesWhite(): number {
        let moves = (this.empty >> 4) & this.white;
        moves |= ((this.empty & RIGHT3) >> 3) & this.white;
        moves |= ((this.empty & RIGHT5) >> 5) & this.white;

        if (this.whiteKing) {
            moves |= (this.empty << 4) & this.whiteKing;
            moves |= ((this.empty & LEFT3) << 3) & this.whiteKing;
            moves |= ((this.empty & LEFT5) << 3) & this.whiteKing;
        }

        return moves;
    }

    getMovablePiecesBlack(): number {
        let moves = (this.empty << 4) & this.black;
        moves |= ((this.empty & LEFT3) << 3) & this.black;
        moves |= ((this.empty & LEFT5) << 5) & this.black;

        if (this.blackKing) {
            moves |= (this.empty >> 4) & this.blackKing;
            moves |= ((this.empty & RIGHT3) >> 3) & this.blackKing;
            moves |= ((this.empty & RIGHT5) >> 5) & this.blackKing;
        }

        return moves;
    }


    getCapturePiecesWhite(): number {
            
        let captures = 0;
        let temp = (this.empty >> 4) & this.black;

        if (temp) captures |= ((temp & RIGHT3) >> 3 | (temp & RIGHT5) >> 5) & this.white;
        temp = (this.empty & RIGHT3) >> 3 | (this.empty & RIGHT5) >> 5;

        if (this.whiteKing) {
            temp = (this.empty << 4) & this.black;
            if (temp) captures |= ((temp & LEFT3) << 3 | (temp & LEFT5) << 5) & this.whiteKing;
            temp = ((this.empty & LEFT3) << 3 | (this.empty & LEFT5) << 5) & this.black;
            if (temp) captures |= (temp << 4)  & this.whiteKing;
        }
        return captures;
    }

    getCapturePiecesBlack(): number {

        let captures = 0;
        let temp = (this.empty << 4) & this.white;

        if (temp) captures |= ((temp & LEFT3) << 3 | (temp & LEFT5) << 5) & this.black;
        temp = (this.empty & LEFT3) << 3 | (this.empty & LEFT5) << 5;

        if (this.blackKing) {
            temp = (this.empty >> 4) & this.white;
            if (temp) captures |= ((temp & RIGHT3) >> 3 | (temp & RIGHT5) >> 5) & this.blackKing;
            temp = ((this.empty & RIGHT3) >> 3 | (this.empty & RIGHT5) >> 5) & this.white;
            if (temp) captures |= (temp >> 4)  & this.blackKing;
        }
        return captures;
    }

    getMovesWhite(start: number) {
        const moveList: Move[] = [];
        const captures = 0;

        const destinations = [
            start << 4,
            (start & LEFT3) << 3,
            (start & LEFT5) << 5,
        ];
        if (start & this.whiteKing) {
            destinations.push(
                start >> 4,
                (start & RIGHT3) >> 3,
                (start & RIGHT5) >> 5,
            );
        }
        destinations.forEach((end) => {
            if (end & this.empty) moveList.push({ start, end, captures });
        });
    
        return moveList;
    }

    getMovesBlack(start: number) {
        const moveList: Move[] = [];
        const captures = 0;

        const destinations = [
            start >> 4,
            (start & RIGHT3) >> 3,
            (start & RIGHT5) >> 5,
        ];
        if (start & this.blackKing) {
            destinations.push(
                start << 4,
                (start & LEFT3) << 3,
                (start & LEFT5) << 5,
            );
        }
        destinations.forEach((end) => {
            if (end & this.empty) moveList.push({ start, end, captures });
        });
    
        return moveList;
    }

    getCapturesWhite(start: number, king=start & this.whiteKing): Move[] {
        const moves: Move[] = [];
        const bitshifts = [4, -4, 3, -3, 5, -5];
    
        for (const jump of bitshifts) {
            const c = (start << jump) & this.black & (jump === 4 || jump === -4 ? this.empty : LEFT3 << jump > 0 ? LEFT3 : RIGHT3);
            if (c) {
                moves.push({ start, end: c >> Math.abs(jump), captures: c });
            }
            if (king && jump < 0) {
                const c = (start >> -jump) & this.black & (jump === -4 ? this.empty : RIGHT3);
                if (c) {
                moves.push({ start, end: c >> -jump, captures: c });
                }
            }
        }
        return moves;
    }

    getCapturesBlack(start: number, king=start & this.blackKing): Move[] {
        const moves: Move[] = [];
        const bitshifts = [4, -4, 3, -3, 5, -5];
    
        for (const jump of bitshifts) {
            const c = (start >> jump) & this.white & (jump === 4 || jump === -4 ? this.empty : RIGHT3 >> jump > 0 ? RIGHT3 : LEFT3);
            if (c) {
                moves.push({ start, end: c << Math.abs(jump), captures: c });
            }
            if (king && jump > 0) {
                const c = (start << jump) & this.white & (jump === 4 ? this.empty : LEFT3);
                if (c) {
                moves.push({ start, end: c << jump, captures: c });
                }
            }
        }
        return moves;
    }
    



}

/*
let board = new Board();
console.log(board);
let x = board.getMovablePiecesWhite();
console.log(printBoardNum(x));
x = board.getMovablePiecesBlack();
console.log(printBoardNum(x));

var m: Move = { start: BIN[9], end: BIN[13], captures: 0 };

board = board.makeMoveWhite(m);
printBoard(board);

console.log(getPresentBits(board.black));
*/