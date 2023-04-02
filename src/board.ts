/*
*   Checkers Board
*   ----------------
*     28  29  30  31
*   24  25  26  27
*     20  21  22  23
*   16  17  18  19
*     12  13  14  15
*   08  09  10  11
*     04  05  06  07
*   00  01  02  03
*   ----------------
* 
*   Bitwise Board
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
*/


import { boardStatsDatabase, generateBin, generateKey, generateKeyNumber, getAvrDist, getBoardFomBin, getPieceCount, pad, reverseBits, roundTo } from './helper';
import { BoardStats, Move, Player } from './types';

//const BIN: Record<number, number> = [];
//BIN[0] = 1;
//for (let i=1; i<32; i++) {
//    BIN[i] = BIN[i-1] * 2;
//}

const BIN: Record<number, number> = generateBin();


export var DBHits = 0;
export var DBMisses = 0; 

//console.log(BIN);
//console.log(BIN[31]);

const WHITE_INIT = 0b0000_0000_0000_0000_0000_1111_1111_1111;
const BLACK_INIT = 0b1111_1111_1111_0000_0000_0000_0000_0000;
const KING_INIT = 0b0000_0000_0000_0000_0000_0000_0000_0000;

// Pieces able to  make a shift left 3 (UP LEFT)
const LEFT3 = BIN[5] | BIN[6] | BIN[7] | BIN[13] | BIN[14] | BIN[15] | BIN[21] | BIN[22] | BIN[23];

// Pieces able to  make a shift left 5 (UP RIGHT)
const LEFT5 = BIN[0] | BIN[1] | BIN[2] | BIN[8] | BIN[9] | BIN[10] | BIN[16] | BIN[17] | BIN[18] | BIN[24] | BIN[25] | BIN[26];

// Pieces able to  make a shift right 3 (DOWN RIGHT)
const RIGHT3 = BIN[8] | BIN[9] | BIN[10] | BIN[16] | BIN[17] | BIN[18] | BIN[24] | BIN[25] | BIN[26];

// Pieces able to  make a shift right 5 (DOWN LEFT)
const RIGHT5 = BIN[5] | BIN[6] | BIN[7] | BIN[13] | BIN[14] | BIN[15] | BIN[21] | BIN[22] | BIN[23] | BIN[29] | BIN[30] | BIN[31];


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

    makeMoveBlack(move: Move): Board {
        //console.log('move black', getBoardFomBin(move.start), getBoardFomBin(move.captures), getBoardFomBin(move.end))
        //console.log('this.king', getBoardFomBin(this.king))
        const isKing = move.start & this.king;
        //console.log('isKing', getBoardFomBin(isKing))
        let king = this.king ^ isKing;
        //console.log('king', getBoardFomBin(king))
        king ^= move.captures & this.king;
        //console.log('king', getBoardFomBin(king))
        king |= isKing ? move.end : move.end & KINGROW_BLACK;
        //console.log('king final', getBoardFomBin(king))

        let black = this.black ^ move.start;
        black |= move.end;

        const white = this.white ^ move.captures;

        return new Board(white, black, king);
    }

    getMovablePiecesWhite(): number {
        let moves = (this.empty >>> 4) & this.white;
        moves |= ((this.empty & RIGHT3) >> 3) & this.white;
        moves |= ((this.empty & RIGHT5) >>> 5) & this.white;

        if (this.whiteKing) {
            moves |= (this.empty << 4) & this.whiteKing;
            moves |= ((this.empty & LEFT3) << 3) & this.whiteKing;
            moves |= ((this.empty & LEFT5) << 3) & this.whiteKing;
        }

        //console.log('white moves', getBoardFomBin(moves));

        return moves;
    }

    getMovablePiecesBlack(): number {
        let moves = (this.empty << 4) & this.black;
        moves |= ((this.empty & LEFT3) << 3) & this.black;
        moves |= ((this.empty & LEFT5) << 5) & this.black;

        if (this.blackKing) {
            moves |= (this.empty >>> 4) & this.blackKing;
            moves |= ((this.empty & RIGHT3) >> 3) & this.blackKing;
            moves |= ((this.empty & RIGHT5) >>> 5) & this.blackKing;
        }

        //console.log('black moves', getBoardFomBin(moves));

        return moves;
    }


    getCapturePiecesWhite(): number {
            
        let captures = 0;

        let temp = (this.empty >>> 4) & this.black;
        //console.log('temp', getBoardFomBin(temp));
        if (temp) captures |= ((temp & RIGHT3) >> 3 | (temp & RIGHT5) >>> 5) & this.white;
        //console.log('captures', getBoardFomBin(captures));

        temp = ((this.empty & RIGHT3) >> 3 | (this.empty & RIGHT5) >>> 5) & this.black;
        //console.log('temp2', getBoardFomBin(temp));
        if (temp) captures |= (temp >>> 4) & this.white
        //console.log('captures2', getBoardFomBin(captures));

        if (this.whiteKing) {
            temp = (this.empty << 4) & this.black;
            if (temp) captures |= ((temp & LEFT3) << 3 | (temp & LEFT5) << 5) & this.whiteKing;
            temp = ((this.empty & LEFT3) << 3 | (this.empty & LEFT5) << 5) & this.black;
            if (temp) captures |= (temp << 4) & this.whiteKing;
        }
        return captures;
    }

    getCapturePiecesBlack(): number {

        let captures = 0;

        let temp = (this.empty << 4) & this.white;
        //console.log('temp', getBoardFomBin(temp));
        if (temp) captures |= ((temp & LEFT3) << 3 | (temp & LEFT5) << 5) & this.black;
        //console.log('captures', getBoardFomBin(captures));

        temp = ((this.empty & LEFT3) << 3 | (this.empty & LEFT5) << 5) & this.white;
        //console.log('temp2', getBoardFomBin(temp));
        if (temp) captures |= (temp << 4) & this.black
        //console.log('captures2', getBoardFomBin(captures));

        if (this.blackKing) {
            temp = (this.empty >>> 4) & this.white;
            //console.log('temp3', getBoardFomBin(temp));
            if (temp) captures |= ((temp & RIGHT3) >> 3 | (temp & RIGHT5) >>> 5) & this.blackKing;
            //console.log('captures3', getBoardFomBin(captures));
            temp = ((this.empty & RIGHT3) >> 3 | (this.empty & RIGHT5) >>> 5) & this.white;
            //console.log('temp4', getBoardFomBin(temp));
            if (temp) captures |= (temp >>> 4) & this.blackKing;
            //console.log('captures4', getBoardFomBin(captures));
        }
        //console.log('captures', getBoardFomBin(captures));
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

    getMovesBlack(start: number) {
        const moveList: Move[] = [];
        const captures = 0;


        //if (start & RIGHT5) {
        //    console.log('start', getBoardFomBin(start))
        //    console.log('r5', getBoardFomBin((start & RIGHT5) >>> 5))
        //}

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
            //if (start < 0) {
            //    printBoard(this);
            //    console.log('negative push', 'start', getBoardFomBin(start))
            //    console.log('end', getBoardFomBin(end))
            //    console.log('destinations', destinations.map(d => getBoardFomBin(d)))
            //}
            if (end & this.empty) moveList.push({ start, end, captures });
        });
    
        return moveList;
    }
    
    
    getCapturesWhite(start: number, tabu: number = 0, king = start & this.whiteKing): Move[] {
        const moves: Move[] = [];
        const checkAndPush = (c: number, d: number) => {
            //console.log('c', getBoardFomBin(c), 'd', getBoardFomBin(d));
            //console.log('tabu', getBoardFomBin(tabu));
            //console.log('c & tabu', getBoardFomBin(c & tabu));
            if (d && !(c & tabu)) {
                //console.log('pushed');
                moves.push({ start, end: d, captures: c });
                //console.log('pushed', getBoardFomBin(c), getBoardFomBin(d));
                //console.log('black', getBoardFomBin(this.black));
                //console.log('empty', getBoardFomBin(this.empty));
            }
        };

        //console.log('tabu', getBoardFomBin(tabu));
        //console.log('not tabu', getBoardFomBin(~tabu));
      
        const c1 = (start << 4) & this.black;
        /*console.log('c1', getBoardFomBin(c1), 'd', getBoardFomBin(((c1 & LEFT3) << 3) | ((c1 & LEFT5) << 5) & this.empty));
        console.log('empty', getBoardFomBin(this.empty))
        console.log('left3', getBoardFomBin(LEFT3))
        console.log('just shift', getBoardFomBin(c1 << 3))
        //console.log(getBoardString(c1))
        //console.log(getBoardString(c1 << 3))
        console.log('left5', getBoardFomBin(LEFT5))
        console.log('just shift l5', getBoardFomBin(c1 << 5))
        console.log(getBoardFomBin((c1 & LEFT3) << 3), getBoardFomBin(((c1 & LEFT3) << 3) & this.empty))
        console.log(getBoardFomBin((c1 & LEFT5) << 5), getBoardFomBin(((c1 & LEFT5) << 5) & this.empty))*/

        checkAndPush(c1, (((c1 & LEFT3) << 3) | ((c1 & LEFT5) << 5)) & this.empty);
      
        const c2 = (((start & LEFT3) << 3) | ((start & LEFT5) << 5)) & this.black;
        /*console.log('c2', getBoardFomBin(c2), 'd',getBoardFomBin((c2 << 4) & this.empty))
        console.log(getBoardFomBin((start & LEFT3) << 3), getBoardFomBin(((start & LEFT3) << 3) & this.black))
        console.log(getBoardFomBin((start & LEFT5) << 5), 'this&black', getBoardFomBin(((start & LEFT5) << 5) & this.black))
        console.log('black', getBoardFomBin(this.black))*/
        checkAndPush(c2, (c2 << 4) & this.empty);
      
        if (king) {
            const c3 = (start >>> 4) & this.black;
            checkAndPush(c3, (((c3 & RIGHT3) >> 3) | ((c3 & RIGHT5) >>> 5)) & this.empty);
        
            const c4 = (((start & RIGHT3) >> 3) | ((start & RIGHT5) >>> 5)) & this.black;
            checkAndPush(c4, (c4 >>> 4) & this.empty);
        }

        //console.log('moves', moves)
      
        return moves;
    }

    getCapturesBlack(start: number, tabu: number = 0, king=start & this.blackKing): Move[] {
        const moves: Move[] = [];
        const checkAndPush = (c: number, d: number) => {
            //console.log('c', getBoardFomBin(c), 'd', getBoardFomBin(d));
            //console.log('tabu', getBoardFomBin(tabu));
            //console.log('c & tabu', getBoardFomBin(c & tabu));
            if (d && !(c & tabu)) {
                //console.log('tabu pushed');
                moves.push({ start, end: d, captures: c });
            }
        };
        //console.log('tabu', getBoardFomBin(tabu));
        //console.log('not tabu', getBoardFomBin(~tabu));
      
        const c1 = (start >>> 4) & this.white;
        checkAndPush(c1, (((c1 & RIGHT3) >> 3) | ((c1 & RIGHT5) >>> 5)) & this.empty);
      
        const c2 = (((start & RIGHT3) >> 3) | ((start & RIGHT5) >>> 5)) & this.white;
        //console.log('valid check', getBoardFomBin(start), getBoardFomBin(RIGHT5), getBoardFomBin(start & RIGHT5))
        //console.log('right5', getBoardFomBin(((start & RIGHT5) >> 5)))
        checkAndPush(c2, (c2 >>> 4) & this.empty);
      
        if (king) {
            const c3 = (start << 4) & this.white;
            checkAndPush(c3, (((c3 & LEFT3) << 3) | ((c3 & LEFT5) << 5)) & this.empty);
        
            const c4 = (((start & LEFT3) << 3) | ((start & LEFT5) << 5)) & this.white;
            checkAndPush(c4, (c4 << 4) & this.empty);
        }
      
        return moves;
    }

    getDefendedWhite(): number {
        let defended: number = 0

        defended |= this.white & (EDGES | KINGROW_BLACK | KINGROW_WHITE)

        let temp = (this.white << 4) & this.white
        temp &= (((this.white & LEFT5) << 5) & temp) | (((this.white & LEFT3) << 3) & temp)
        defended |= temp

        //console.log('def white',getBoardFomBin(defended))

        return getPieceCount(defended)
    }

    /*getDefendedBlack(): number {
        let defended: number = 0

        defended |= this.black & (EDGES | KINGROW_BLACK | KINGROW_WHITE)

        let temp = (this.black >>> 4) & this.black
        temp &= (((this.black & RIGHT5) >>> 5) & temp) | (((this.black & RIGHT3) >> 3) & temp)
        defended |= temp

        //console.log('def black',getBoardFomBin(defended))

        return getPieceCount(defended)
    }*/

    // attacks should include defended pieces but not uncapturable pieces
    getAttacksWhite(): number {
        let attacks: number = 0
        let attackable = this.black & ~(EDGES | KINGROW_BLACK | KINGROW_WHITE)

        //console.log('attackable',getBoardFomBin(attackable))

        attacks |= attackable >> 4 & this.white
        //console.log('1',getBoardFomBin(attacks))
        //console.log('2',getBoardFomBin(((attackable & RIGHT3) >> 3 | (attackable & RIGHT5) >>> 5) & this.white))
        attacks |= ((attackable & RIGHT3) >> 3 | (attackable & RIGHT5) >>> 5) & this.white

        //console.log('att white',getBoardFomBin(attacks))

        return getPieceCount(attacks)
    }

    getAttacksBlack(): number {
        let attacks: number = 0
        let attackable = this.white & ~(EDGES | KINGROW_BLACK | KINGROW_WHITE)

        attacks |= attackable << 4 & this.black
        attacks |= ((attackable & LEFT3) << 3 | (attackable & LEFT5) << 5) & this.black

        //console.log('att black',getBoardFomBin(attacks))

        return getPieceCount(attacks)
    }

    /*getBoardStats1(): BoardStats {

        //TODO: could be more efficient to save white layouts and black layouts seperately as piece layouts, then can make seperate lookups

        //let key = generateKey1(this.white, this.black, this.king);
        let key = 0
        
        
        //console.log('key', key)
        //console.log('database', boardStatsDatabase)
        if (key in boardStatsDatabase) {
            //console.log('database hit')
            //console.log(JSON.parse(boardStatsDatabase[key]))
            //console.log(boardStatsDatabase[key])
            //return JSON.parse(boardStatsDatabase[key]);
            DBHits++;
            return boardStatsDatabase[key];
        } else {
            //console.log('database miss')
            let stats: BoardStats = {
                'pieces': getPieceCount(this.white) - getPieceCount(this.black),
                'kings': getPieceCount(this.whiteKing) - getPieceCount(this.blackKing),
                'avrDist': roundTo(getAvrDist(this.white) - (7 - getAvrDist(this.black)), 2),
                'backline': getPieceCount(this.white & KINGROW_BLACK) - getPieceCount(this.black & KINGROW_WHITE),
                'corners': getPieceCount(this.white & CORNERS) - getPieceCount(this.black & CORNERS),
                'edges': getPieceCount(this.white & EDGES) - getPieceCount(this.black & EDGES),
                'centre2': getPieceCount(this.white & CENTRE2) - getPieceCount(this.black & CENTRE2),
                'centre4': getPieceCount(this.white & CENTRE4) - getPieceCount(this.black & CENTRE4),
                'centre8': getPieceCount(this.white & CENTRE8) - getPieceCount(this.black & CENTRE8),
                'defended': this.getDefendedWhite() - this.getDefendedBlack(),
                'attacks': this.getAttacksWhite() - this.getAttacksBlack()
            }
            //boardStatsDatabase[key] = JSON.stringify(stats);

            boardStatsDatabase[key] = stats

            //console.log(stats)
            DBMisses++;
            return stats;
        }
    }*/


    /**/
    //getBoardStats(persist: boolean = false): BoardStats {


    getBoardStats(): BoardStats {


        //TODO - calc for white, for black flib bits and search db. only calc black attacks seperately.
        //can use same key, and backline = KINGROW_BLACK (white backline) for all
        //can put avrDist, backline, defended into main search based on pieces key since player not required,
        // and just attacks and kings seperately.

        let whiteKey = this.white
        //console.log('\n')
        //console.log('w',getBoardFomBin(whiteKey))

        let whiteStats: BoardStats;
        if (boardStatsDatabase.has(whiteKey)) {
            //if (returnRes) {
            whiteStats = boardStatsDatabase.get(whiteKey)!;
            //console.log('read white', whiteStats)
            DBHits++; 
            //}
        } else {
            whiteStats = this.getBoardStatsForWhite(this.white);
            //console.log('write white', whiteStats)
            //if (persist) {
            //    boardStatsDatabase.put(whiteKey, whiteStats);
            //} else {
            DBMisses++;
            //} 
        }
        //whiteStats = this.combineExtraStats(whiteStats, this.getExtraStats(this.whiteKing, Player.WHITE))
        whiteStats["kings"] = getPieceCount(this.whiteKing),
        whiteStats["attacks"] = this.getAttacksWhite()
        //console.log('combined white', whiteStats!)
    
        
        //let blackKey = this.black//generateKey(this.black, this.blackKing);

        let reverseBlack = reverseBits(this.black)

        //console.log('\n')
        //console.log('before', getBoardFomBin(this.black), 'after', getBoardFomBin(reverseBlack))

        let blackStats: BoardStats;
        //if (blackKey in boardStatsDatabase) {
        if (boardStatsDatabase.has(reverseBlack)) {
            blackStats = boardStatsDatabase.get(reverseBlack)!;
            //console.log('read black', blackStats)
            DBHits++;
        } else {
            blackStats = this.getBoardStatsForWhite(reverseBlack);
            //console.log('write black', blackStats)
            //if (persist) {
            //    boardStatsDatabase.put(reverseBlack, blackStats);
            //} else {
            DBMisses++;
            //}
        }
        blackStats["kings"] = getPieceCount(this.blackKing),
        blackStats["attacks"] = this.getAttacksBlack()

        //console.log('combined black', blackStats)

        //blackStats = this.getExtraStats(blackStats, this.black, this.blackKing, Player.BLACK)
        //blackStats['kings'] = getPieceCount(this.blackKing);

        //console.log(boardStatsDatabase)

        
        //console.log('result', this.getBoardStatDifferece(whiteStats!, blackStats))

        return this.getBoardStatDifferece(whiteStats, blackStats);


    }

    persistStatsForValue(pieces: number, player: Player): void {
        //let key = generateKey(pieces, kings);
        let key = player === Player.WHITE ? pieces : reverseBits(pieces);
        let stats: BoardStats;
        //console.log('player', player, 'pieces', pieces, getBoardFomBin(pieces), 'key', key, getBoardFomBin(key))
        if (!boardStatsDatabase.has(key)) {
            stats = this.getBoardStatsForWhite(key);
            //console.log('write persist', stats)
            boardStatsDatabase.put(key, stats);
        }

    }

    /*getBoardStats2(persist: boolean = false, returnRes: boolean = true): BoardStats {


        //generateKey(this.white, this.whiteKing);

        //2073
        /*
        attacks: 0 avrDist: 1 backline: 0 centre2: 0 centre4: 0 centre8: 2 corners: 2 defended: 12 edges: 3 kings: 0 pieces: 12
        *


        //TODO - calc for white, for black flib bits and search db. only calc black attacks seperately.
        //can use same key, and backline = KINGROW_BLACK (white backline) for all
        //can put avrDist, backline, defended into main search based on pieces key since player not required,
        // and just attacks and kings seperately.

        let whiteKey = this.white
        console.log('\n')
        console.log(getBoardFomBin(whiteKey))

        let whiteStats: BoardStats;
        if (boardStatsDatabase.has(whiteKey)) {
            whiteStats = boardStatsDatabase.get(whiteKey)!;
            console.log('read white', whiteStats)
            DBHits++; 
        } else {
            whiteStats = this.getBoardStatsForColour(this.white);
            console.log('write white', whiteStats)
            if (persist) {
                boardStatsDatabase.put(whiteKey, whiteStats);
            } else {
                DBMisses++;
            } 
        }

        let whiteKey2 = generateKeyNumber(this.white, this.whiteKing, Player.WHITE);
        let whiteExtraStats: BoardStats;
        if (boardStatsDatabase.has(whiteKey2)) {
            whiteExtraStats = boardStatsDatabase.get(whiteKey2)!;
            console.log('read white2', whiteExtraStats)
            DBHits++;
        } else {
            whiteExtraStats = this.getExtraStats(this.white, this.whiteKing, Player.WHITE)
            console.log('write white2', whiteExtraStats)
            if (persist) {
                boardStatsDatabase.put(whiteKey2, whiteExtraStats);
            } else {
                DBMisses++;
            }
        }
        whiteStats = this.combineExtraStats(whiteStats, whiteExtraStats)
        console.log('combined white', whiteStats)
        //attacks requires info for both colours pieces, not worth persisting
        whiteStats["attacks"] = this.getAttacksWhite()


        let blackKey = this.black//generateKey(this.black, this.blackKing);
        console.log('\n')
        console.log(getBoardFomBin(blackKey))

        let blackStats: BoardStats;
        //if (blackKey in boardStatsDatabase) {
        if (boardStatsDatabase.has(blackKey)) {
            blackStats = boardStatsDatabase.get(blackKey)!;
            console.log('read black', blackStats)
            DBHits++;
        } else {
            blackStats = this.getBoardStatsForColour(this.black);
            console.log('write black', blackStats)
            if (persist) {
                boardStatsDatabase.put(blackKey, blackStats);
            } else {
                DBMisses++;
            }
        }

        let blackKey2 = generateKeyNumber(this.black, this.blackKing, Player.BLACK);
        let blackExtraStats: BoardStats;
        if (boardStatsDatabase.has(blackKey2)) {
            blackExtraStats = boardStatsDatabase.get(blackKey2)!;
            console.log('read black2', blackExtraStats)
            DBHits++;
        } else {
            blackExtraStats = this.getExtraStats(this.black, this.blackKing, Player.BLACK)
            console.log('write black2', blackExtraStats)
            if (persist) {
                boardStatsDatabase.put(blackKey2, blackExtraStats);
            } else {
                DBMisses++;
            }
        }
        blackStats = this.combineExtraStats(blackStats, blackExtraStats)
        console.log('combined black', blackStats)
        blackStats["attacks"] = this.getAttacksBlack()

        //blackStats = this.getExtraStats(blackStats, this.black, this.blackKing, Player.BLACK)
        //blackStats['kings'] = getPieceCount(this.blackKing);

        //console.log(boardStatsDatabase)

        console.log('result', this.getBoardStatDifferece(whiteStats, blackStats))

        if (returnRes) {
            return this.getBoardStatDifferece(whiteStats, blackStats);
        } else {
            return whiteStats;
        }

    }*/



    /*getBoardStatsCurrent(persist: boolean = false, returnRes: boolean = true): BoardStats {


        //let whiteKey = generateKey(this.white, this.whiteKing);
        //let blackKey = generateKey(this.black, this.blackKing);

        let whiteKey = generateKey(this.white, this.whiteKing);
        let blackKey = generateKey(this.black, this.blackKing);

        
        let whiteStats: BoardStats;
        if (boardStatsDatabase.has(whiteKey)) {
            whiteStats = boardStatsDatabase.get(whiteKey)!;
            DBHits++;
        } else {
            whiteStats = this.getBoardStatsForColour(this.white, this.whiteKing, Player.WHITE);
            if (persist) {
                boardStatsDatabase.put(whiteKey, whiteStats);
            } else {
                DBMisses++;
            } 
        }

        let blackStats: BoardStats;
        //if (blackKey in boardStatsDatabase) {
        if (boardStatsDatabase.has(blackKey)) {
            blackStats = boardStatsDatabase.get(blackKey)!;
            DBHits++;
        } else {
            blackStats = this.getBoardStatsForColour(this.black, this.blackKing, Player.BLACK);
            //if (persist) boardStatsDatabase[blackKey] = blackStats;
            if (persist) {
                boardStatsDatabase.put(blackKey, blackStats);
            } else {
                DBMisses++;
            }
        }

        //console.log(boardStatsDatabase)

        if (returnRes) {
            return this.getBoardStatDifferece(whiteStats, blackStats);
        } else {
            return whiteStats;
        }

    }*/

    

    /*getBoardStatsForColour(value: number): BoardStats {
        return {
            'pieces'    : getPieceCount(value),
            'corners'   : getPieceCount(value & CORNERS),
            'edges'     : getPieceCount(value & (EDGES | KINGROW_WHITE | KINGROW_BLACK)),
            'centre2'   : getPieceCount(value & CENTRE2),
            'centre4'   : getPieceCount(value & CENTRE4),
            'centre8'   : getPieceCount(value & CENTRE8),
            'avrDist'   : getAvrDist(pieces, player),
            //'attacks'   : player === Player.WHITE ? this.getAttacksWhite() : this.getAttacksBlack()
        }
    }*/

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
            'defended'  : this.getDefendedWhite(),
        }
    }

    /*getExtraStats(kings: number, player: Player): BoardStats {
        //stats not obtainable from just the piece positions, requires king/player info
        return {
            'kings'     : getPieceCount(kings),
            'attacks'   : player === Player.WHITE ? this.getAttacksWhite() : this.getAttacksBlack()
        };
    }

    getExtraStats1(pieces: number, kings: number, player: Player): BoardStats {
        //stats not obtainable from just the piece positions, requires king/player info
        return {
            'kings'     : getPieceCount(kings),
            'avrDist'   : getAvrDistPlayer(pieces, player),
            'backline'  : player === Player.WHITE ? getPieceCount(pieces & KINGROW_BLACK): getPieceCount(pieces & KINGROW_WHITE),
            'defended'  : player === Player.WHITE ? this.getDefendedWhite() : this.getDefendedBlack(),
            //'attacks'   : player === Player.WHITE ? this.getAttacksWhite() : this.getAttacksBlack()
        };
    }

    combineExtraStats(stats: BoardStats, extraStats: BoardStats): BoardStats {
        //stats not obtainable from just the piece positions
        for (let key in extraStats) {
            stats[key] = extraStats[key];
        }
        return stats;
    }*/

    /*getBoardStatsForColour(value: number, king: number, player: Player): BoardStats {
        return {
            'pieces'    : getPieceCount(value),
            'kings'     : getPieceCount(king),
            'avrDist'   : getAvrDist(value),
            'backline'  : player === Player.WHITE ? getPieceCount(value & KINGROW_WHITE): getPieceCount(value & KINGROW_BLACK),
            'corners'   : getPieceCount(value & CORNERS),
            'edges'     : getPieceCount(value & EDGES),
            'centre2'   : getPieceCount(value & CENTRE2),
            'centre4'   : getPieceCount(value & CENTRE4),
            'centre8'   : getPieceCount(value & CENTRE8),
            'defended'  : player === Player.WHITE ? this.getDefendedWhite() : this.getDefendedBlack(),
            'attacks'   : player === Player.WHITE ? this.getAttacksWhite() : this.getAttacksBlack()
        }
    }*/

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



//let board = new Board();
//printBoard(board);
//generateKey(board.white, board.black, board.king)




//console.log(board);

/*let board = new Board();
printBoard(board);
const s = performance.now();
board.getBoardStats();
const e = performance.now();
console.log('test1', e - s); // 0.766199991106987

const s2 = performance.now();
for (let i = 0; i < 100; i++) {
    board.getBoardStats();
}
//board.getBoardStats();
const e2 = performance.now();
console.log('test2', (e2 - s2)/100); // 0.01799999177455902
*/


//const s3 = performance.now();
//const e3 = performance.now();
//console.log(boardStatsDatabase['12w8012b'])
//console.log('test3', e3 - s3);

//let json = JSON.stringify(boardStatsDatabase['12w8012b'])
//console.log(json)
//console.log(JSON.parse(json))




/*let x = board.getMovablePiecesWhite();
console.log(getBoardFomBin(x));
x = board.getMovablePiecesBlack();
console.log(getBoardFomBin(x));

var m: Move = { start: BIN[9], end: BIN[13], captures: 0 };

board = board.makeMoveWhite(m);
printBoard(board);

console.log(getPresentBits(board.black));
*/