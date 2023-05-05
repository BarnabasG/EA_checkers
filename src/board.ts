/* 
    *    Bitwise Board
    *   ----------------
    *     31  30  29  28
    *   27  26  25  24
    *     23  22  21  20
    *   19  18  17  16
    *     15  14  13  12
    *   11  10  09  08
    *     07  06  05  04
    *   03  02  01  00
    *  ----------------
    *
    *   WCDF Board
    *  ----------------
    *    01  02  03  04
    *  05  06  07  08
    *    09  10  11  12
    *  13  14  15  16
    *    17  18  19  20
    *  21  22  23  24
    *    25  26  27  28
    *  29  30  31  32
    *  ----------------
    *
*/


import { BloomDatabase, HashMap } from './database';
import { generateBin, getAvrDist, getPieceCount, reverseBits, roundTo } from './helper';
import { BoardStats, Move, Player } from './types';


const BIN: Record<number, number> = generateBin();

export var DBHits = 0
export var DBMisses = 0;

const WHITE_INIT = 0b0000_0000_0000_0000_0000_1111_1111_1111;
const BLACK_INIT = 0b1111_1111_1111_0000_0000_0000_0000_0000;
const KING_INIT = 0b0000_0000_0000_0000_0000_0000_0000_0000;

// pieces able to  make a shift left 3 (UP RIGHT)
const LEFT3 = BIN[5] | BIN[6] | BIN[7] | BIN[13] | BIN[14] | BIN[15] | BIN[21] | BIN[22] | BIN[23];

// pieces able to  make a shift left 5 (UP LEFT)
const LEFT5 = BIN[0] | BIN[1] | BIN[2] | BIN[8] | BIN[9] | BIN[10] | BIN[16] | BIN[17] | BIN[18] | BIN[24] | BIN[25] | BIN[26];

// pieces able to  make a shift right 3 (DOWN LEFT)
const RIGHT3 = BIN[8] | BIN[9] | BIN[10] | BIN[16] | BIN[17] | BIN[18] | BIN[24] | BIN[25] | BIN[26];

// pieces able to  make a shift right 5 (DOWN RIGHT)
const RIGHT5 = BIN[5] | BIN[6] | BIN[7] | BIN[13] | BIN[14] | BIN[15] | BIN[21] | BIN[22] | BIN[23] | BIN[29] | BIN[30] | BIN[31];


// mask for relevant board squares
const KINGROW_WHITE = BIN[28] | BIN[29] | BIN[30] | BIN[31];
const KINGROW_BLACK = BIN[0] | BIN[1] | BIN[2] | BIN[3];
const CORNERS = BIN[3] | BIN[28];
const EDGES = BIN[3] | BIN[4] | BIN[11] | BIN[12] | BIN[19] | BIN[20] | BIN[27] | BIN[28];
const CENTRE2 = BIN[14] | BIN[17];
const CENTRE4 = BIN[13] | BIN[14] | BIN[17] | BIN[18];
const CENTRE8 = BIN[9] | BIN[10] |BIN[13] | BIN[14] | BIN[17] | BIN[18] | BIN[21] | BIN[22];


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

    // apply move object to board state for white
    makeMoveWhite(move: Move): Board {
        const isKing = move.start & this.king;
        let king = this.king ^ isKing;
        king ^= move.captures & this.king;
        king |= isKing ? move.end : move.end & KINGROW_WHITE;
        let white = this.white ^ move.start;
        white |= move.end;

        const black = this.black ^ move.captures;

        return new Board(white, black, king);
    }

    // apply move object to board state for black
    makeMoveBlack(move: Move): Board {
        const isKing = move.start & this.king;
        let king = this.king ^ isKing;
        king ^= move.captures & this.king;
        king |= isKing ? move.end : move.end & KINGROW_BLACK;
        let black = this.black ^ move.start;
        black |= move.end;

        const white = this.white ^ move.captures;

        return new Board(white, black, king);
    }

    // get all white pieces that are able to move 
    getMovablePiecesWhite(): number {
        let moves = (this.empty >>> 4) & this.white;
        moves |= ((this.empty & RIGHT3) >> 3) & this.white;
        moves |= ((this.empty & RIGHT5) >>> 5) & this.white;

        if (this.whiteKing) {
            moves |= (this.empty << 4) & this.whiteKing;
            moves |= ((this.empty & LEFT3) << 3) & this.whiteKing;
            moves |= ((this.empty & LEFT5) << 3) & this.whiteKing;
        }

        return moves;
    }

    // get all black pieces that are able to move
    getMovablePiecesBlack(): number {
        let moves = (this.empty << 4) & this.black;
        moves |= ((this.empty & LEFT3) << 3) & this.black;
        moves |= ((this.empty & LEFT5) << 5) & this.black;

        if (this.blackKing) {
            moves |= (this.empty >>> 4) & this.blackKing;
            moves |= ((this.empty & RIGHT3) >> 3) & this.blackKing;
            moves |= ((this.empty & RIGHT5) >>> 5) & this.blackKing;
        }

        return moves;
    }


    // get all white pieces that are able to capture
    getCapturePiecesWhite(): number {
            
        let captures = 0;

        let temp = (this.empty >>> 4) & this.black;
        if (temp) captures |= ((temp & RIGHT3) >> 3 | (temp & RIGHT5) >>> 5) & this.white;

        temp = ((this.empty & RIGHT3) >> 3 | (this.empty & RIGHT5) >>> 5) & this.black;
        if (temp) captures |= (temp >>> 4) & this.white

        if (this.whiteKing) {
            temp = (this.empty << 4) & this.black;
            if (temp) captures |= ((temp & LEFT3) << 3 | (temp & LEFT5) << 5) & this.whiteKing;
            temp = ((this.empty & LEFT3) << 3 | (this.empty & LEFT5) << 5) & this.black;
            if (temp) captures |= (temp << 4) & this.whiteKing;
        }
        return captures;
    }

    // get all black pieces that are able to capture
    getCapturePiecesBlack(): number {

        let captures = 0;

        let temp = (this.empty << 4) & this.white;
        if (temp) captures |= ((temp & LEFT3) << 3 | (temp & LEFT5) << 5) & this.black;

        temp = ((this.empty & LEFT3) << 3 | (this.empty & LEFT5) << 5) & this.white;
        if (temp) captures |= (temp << 4) & this.black

        if (this.blackKing) {
            temp = (this.empty >>> 4) & this.white;
            if (temp) captures |= ((temp & RIGHT3) >> 3 | (temp & RIGHT5) >>> 5) & this.blackKing;
            temp = ((this.empty & RIGHT3) >> 3 | (this.empty & RIGHT5) >>> 5) & this.white;
            if (temp) captures |= (temp >>> 4) & this.blackKing;
        }
        return captures;
    }

    // get all moves from a given white piece
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
                start >>> 4,
                (start & RIGHT3) >> 3,
                (start & RIGHT5) >>> 5,
            );
        }
        destinations.forEach((end) => {
            if (end & this.empty) moveList.push({ start, end, captures });
        });
    
        return moveList;
    }

    // get all moves from a given black piece
    getMovesBlack(start: number) {
        const moveList: Move[] = [];
        const captures = 0;

        const destinations = [
            start >>> 4,
            (start & RIGHT3) >> 3,
            (start & RIGHT5) >>> 5,
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
    
    // get all captures from a given white piece
    getCapturesWhite(start: number, tabu: number = 0, king = start & this.whiteKing): Move[] {
        const moves: Move[] = [];
        const checkAndPush = (c: number, d: number) => {
            if (d && !(c & tabu)) {
                moves.push({ start, end: d, captures: c });
            }
        };

        const c1 = (start << 4) & this.black;
        checkAndPush(c1, (((c1 & LEFT3) << 3) | ((c1 & LEFT5) << 5)) & this.empty);
      
        const c2 = (((start & LEFT3) << 3) | ((start & LEFT5) << 5)) & this.black;
        checkAndPush(c2, (c2 << 4) & this.empty);
      
        if (king) {
            const c3 = (start >>> 4) & this.black;
            checkAndPush(c3, (((c3 & RIGHT3) >> 3) | ((c3 & RIGHT5) >>> 5)) & this.empty);
        
            const c4 = (((start & RIGHT3) >> 3) | ((start & RIGHT5) >>> 5)) & this.black;
            checkAndPush(c4, (c4 >>> 4) & this.empty);
        }
      
        return moves;
    }

    // get all captures from a given black piece
    getCapturesBlack(start: number, tabu: number = 0, king=start & this.blackKing): Move[] {
        const moves: Move[] = [];
        const checkAndPush = (c: number, d: number) => {
            if (d && !(c & tabu)) {
                moves.push({ start, end: d, captures: c });
            }
        };

        const c1 = (start >>> 4) & this.white;
        checkAndPush(c1, (((c1 & RIGHT3) >> 3) | ((c1 & RIGHT5) >>> 5)) & this.empty);
      
        const c2 = (((start & RIGHT3) >> 3) | ((start & RIGHT5) >>> 5)) & this.white;
        checkAndPush(c2, (c2 >>> 4) & this.empty);
      
        if (king) {
            const c3 = (start << 4) & this.white;
            checkAndPush(c3, (((c3 & LEFT3) << 3) | ((c3 & LEFT5) << 5)) & this.empty);
        
            const c4 = (((start & LEFT3) << 3) | ((start & LEFT5) << 5)) & this.white;
            checkAndPush(c4, (c4 << 4) & this.empty);
        }
      
        return moves;
    }


    // return a copy of the board object
    _copy(): Board {
        return new Board(this.white, this.black, this.king);
    }

    // get count of defended pieces for a given colour
    getDefended(pieces: number, oppPieces: number): number {
        let defended: number = 0

        defended |= pieces & (EDGES | KINGROW_BLACK | KINGROW_WHITE)

        let temp = (pieces << 4) & (pieces | oppPieces)
        temp &= (((pieces & LEFT5) << 5) & temp) | (((pieces & LEFT3) << 3) & temp)
        defended |= temp

        return getPieceCount(defended)
    }

    // get count of attacking white pieces 
    getAttacksWhite(): number {
        let attacks: number = 0
        let attackable = this.black & ~(EDGES | KINGROW_BLACK | KINGROW_WHITE)

        attacks |= attackable >> 4 & this.white
        attacks |= ((attackable & RIGHT3) >> 3 | (attackable & RIGHT5) >>> 5) & this.white

        return getPieceCount(attacks)
    }

    // get count of attacking black pieces
    getAttacksBlack(): number {
        let attacks: number = 0
        let attackable = this.white & ~(EDGES | KINGROW_BLACK | KINGROW_WHITE)

        attacks |= attackable << 4 & this.black
        attacks |= ((attackable & LEFT3) << 3 | (attackable & LEFT5) << 5) & this.black

        return getPieceCount(attacks)
    }

    // get board stats for current board
    getBoardStats(boardStatsDatabase: BloomDatabase | HashMap): BoardStats {

        let whiteKey = this.white

        let whiteStats: BoardStats;
        if (boardStatsDatabase.has(whiteKey)) {
            whiteStats = boardStatsDatabase.get(whiteKey)!;
            DBHits++; 
        } else {
            whiteStats = this.getBoardStatsForWhite(this.white);
            DBMisses++;
        }
        whiteStats["kings"] = getPieceCount(this.whiteKing)
        whiteStats["defended"] = this.getDefended(this.white, this.black)
        whiteStats["attacks"] = this.getAttacksWhite()
    
        let reverseBlack = reverseBits(this.black)

        let blackStats: BoardStats;
        if (boardStatsDatabase.has(reverseBlack)) {
            blackStats = boardStatsDatabase.get(reverseBlack)!;
            DBHits++;
        } else {
            blackStats = this.getBoardStatsForWhite(reverseBlack);
            DBMisses++;
        }
        blackStats["kings"] = getPieceCount(this.blackKing)
        blackStats["defended"] = this.getDefended(this.black, this.white)
        blackStats["attacks"] = this.getAttacksBlack()

        return this.getBoardStatDifferece(whiteStats, blackStats);
    }

    // calculate and persist board stats to database
    persistStatsForValue(boardStatsDatabase: BloomDatabase | HashMap, pieces: number, player: Player): boolean {

        let key = player === Player.WHITE ? pieces : reverseBits(pieces);
        let stats: BoardStats;
        if (!boardStatsDatabase.has(key)) {
            stats = this.getBoardStatsForWhite(key);
            boardStatsDatabase.put(key, stats);
            return true;
        }
        return false;

    }

    // get board stats for a given board value
    getBoardStatsForWhite(value: number): BoardStats {
        return {
            'pieces'    : getPieceCount(value),
            'corners'   : getPieceCount(value & CORNERS),
            'edges'     : getPieceCount(value & (EDGES | KINGROW_WHITE | KINGROW_BLACK)),
            'centre2'   : getPieceCount(value & CENTRE2),
            'centre4'   : getPieceCount(value & CENTRE4),
            'centre8'   : getPieceCount(value & CENTRE8),
            'avrDist'   : getAvrDist(value),
            'backline'  : getPieceCount(value & KINGROW_BLACK),
            //'defended'  : this.getDefended(value),
        }
    }

    // get difference between two sets of board stat counts
    getBoardStatDifferece(statsWhite: BoardStats, statsBlack: BoardStats): BoardStats {
        return {
            'pieces'    : statsWhite.pieces - statsBlack.pieces,
            'kings'     : statsWhite.kings - statsBlack.kings,
            'avrDist'   : roundTo(statsWhite.avrDist - statsBlack.avrDist, 2),
            'backline'  : statsWhite.backline - statsBlack.backline,
            'corners'   : statsWhite.corners - statsBlack.corners,
            'edges'     : statsWhite.edges - statsBlack.edges,
            'centre2'   : statsWhite.centre2 - statsBlack.centre2,
            'centre4'   : statsWhite.centre4 - statsBlack.centre4,
            'centre8'   : statsWhite.centre8 - statsBlack.centre8,
            'defended'  : statsWhite.defended - statsBlack.defended,
            'attacks'   : statsWhite.attacks - statsBlack.attacks
        }
    }
}