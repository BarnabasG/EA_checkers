import { naiveMinimax } from "./ai"
import { Board } from "./board"
import { CheckersGame } from "./checkers"
import { BloomFilter, BoardStats, HashTable, Move, Player } from "./types"

// Bloom filter hashmap, holds space efficient set membership as well as a hash table object with key value pairs
export class BloomDatabase {
    private bloomFilter: BloomFilter;
    private boardStatsDatabase: HashTable;
    constructor() {
        //this.boardStatsDatabase = new BloomHashMapBoardStats();
        this.bloomFilter = new BloomFilter();
        this.boardStatsDatabase = {};
    }
    getSize(): number {
        return this.bloomFilter.getSize();
    }
    has(key: number): boolean {
        return this.bloomFilter.has(key);
    }
    get(key: number): BoardStats | undefined {
        //return this.boardStatsDatabase.get(key);
        return this.boardStatsDatabase[key];
    }
    put(key: number, value: BoardStats): void {
        //this.boardStatsDatabase.put(key, value);
        this.bloomFilter.add(key);
        this.boardStatsDatabase[key] = value;
    }
    generate(openingDepth: number = 8, gameDepth: number = 9, maxPieces = 4): void {
        generateDatabase(this, openingDepth, gameDepth, maxPieces);
    }
}


// Hashmap, holds key value pairs
export class HashMap {
    public boardStatsDatabase: HashTable;
    constructor() {
        this.boardStatsDatabase = {};
    }
    getSize(): number {
        return Object.keys(this.boardStatsDatabase).length;
    }
    has(key: number): boolean {
        return (key in this.boardStatsDatabase);
    }
    get(key: number): BoardStats | undefined {
        return this.boardStatsDatabase[key];
    }
    put(key: number, value: BoardStats): void {
        this.boardStatsDatabase[key] = value;
    }
    generate(openingDepth: number = 8, gameDepth: number = 9, maxPieces = 4): void {
        generateDatabase(this, openingDepth, gameDepth, maxPieces);
    }
}

// Generate a database of expected positions and their corresponding board statistics for recall during training and gameplay
export function generateDatabase(db: BloomDatabase | HashMap, openingDepth: number, gameDepth: number, maxPieces: number): void {

    let lengthBefore: number = db.getSize();

    console.log(`Populating database... (${(typeof db)})`)

    generateOpeningBookPositions(db, openingDepth);
    //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved in opening book`)
    console.log(`${db.getSize() - lengthBefore} boards saved after opening book`)
    naivePlaythough(db, gameDepth);
    //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved in naive game`)
    console.log(`${db.getSize() - lengthBefore} boards saved after naive game`)
    generateEndgameDatabase(db, maxPieces);
    
    //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved`)
    console.log(`${db.getSize() - lengthBefore} boards saved after endgame database`)
}

// Generate positions stemming from the opening position of play
function generateOpeningBookPositions(db: BloomDatabase | HashMap, openingDepth: number): void {

    let checkers = new CheckersGame();

    function getNextMoves(checkers: CheckersGame, depth: number) {
        if ( depth === 0 ) return

        for (const move of checkers.getMoves()) {
            const newCheckers = checkers.makeMove(move);
            //newCheckers.board.getBoardStats(true, false);
            const p = newCheckers.player === Player.WHITE ? newCheckers.board.black : newCheckers.board.white;
            newCheckers.board.persistStatsForValue(db, p, newCheckers.player === Player.WHITE ? Player.BLACK : Player.WHITE)
            //console.log(boardStatsDatabase.size)
            getNextMoves(newCheckers, depth - 1);
        }
    }

    checkers.board.persistStatsForValue(db, checkers.board.white, Player.WHITE);
    getNextMoves(checkers, openingDepth)
}

// Generate positions found through a naive game simulation
function naivePlaythough(db: BloomDatabase | HashMap, depth: number) {
    let c = new CheckersGame();
    for (let moveIndex = 0; moveIndex < 200; moveIndex++) {
        let moves = c.getMoves();
        if (moves.length == 0) return
        let move = naiveMinimax(c, depth, db);
        c = c.makeMove(move);
    }
}

// Generate positions found at the end of games
function generateEndgameDatabase(db: BloomDatabase | HashMap, maxPieces: number): void {
    let i = 0;
    let b = new Board();

    function generatePositions(board: number, maxPieces: number, callback: (pieces: number) => void, startIndex = 0): void {
        if (maxPieces === 0) {
          return;
        }
      
        let j = startIndex;
        while (j < 32 && (board & (1 << j)) !== 0) {
            j++;
        }
      
        for (; j < 32; j++) {
            if ((board & (1 << j)) === 0) {
                // Place a piece on this square
                const newBoard = board | (1 << j);
                callback(newBoard);
                generatePositions(newBoard, maxPieces - 1, callback, j + 1);
            }
        }
    }

    generatePositions(0, maxPieces, (pieces) => {
        b.persistStatsForValue(db, pieces, Player.WHITE);
        i++
    });
}



export function generateEvaluationDatabase(db: BloomDatabase | HashMap, openingDepth: number, gameDepth: number, maxPieces: number): void {

    let lengthBefore: number = db.getSize();

    console.log(`Populating database... (${(typeof db)})`)

    //TODO
    
    //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved`)
    console.log(`${db.getSize() - lengthBefore} boards saved after endgame database`)
}







/*
function generateOpeningBookPositionsTest(db: BloomDatabase | HashMap, openingDepth: number): number[] { //void {

    let checkers = new CheckersGame();
   
    //console.log('depth', openingDepth)
    let i = 1;
    let hits = 1;
    let boards = new Set<number>();

    function getNextMoves(checkers: CheckersGame, depth: number) {
        if ( depth === 0 ) return

        for (const move of checkers.getMoves()) {
            i++;
            const newCheckers = checkers.makeMove(move);
            //newCheckers.board.getBoardStats(true, false);
            const p = newCheckers.player === Player.WHITE ? newCheckers.board.black : newCheckers.board.white;
            
            //if (newCheckers.board.persistStatsForValue(db, p, newCheckers.player === Player.WHITE ? Player.BLACK : Player.WHITE))
            if (!boards.has(p)) {
                boards.add(p)
                if (newCheckers.board.persistStatsForValue(db, p, checkers.player)) hits += 1;
            }
            //console.log(boardStatsDatabase.size)
            getNextMoves(newCheckers, depth - 1);
        }
    }

    checkers.board.persistStatsForValue(db, checkers.board.white, Player.WHITE);
    boards.add(checkers.board.white)
    getNextMoves(checkers, openingDepth)
    //console.log('boards',i)
    //console.log('unique boards', boards.size)
    return [i, boards.size, hits];
}


function generateEndgameDatabaseTest(db: BloomDatabase | HashMap, maxPieces: number): number {
    let i = 0;
    let b = new Board();

    let hits = 1;
    let boards = new Set<number>();

    function generatePositions(board: number, maxPieces: number, callback: (pieces: number) => void): void {
        if (maxPieces === 0) {
            return;
        }
        for (let j = 0; j < 32; j++) {
            if ((board & (1 << j)) === 0) {
                // Place a piece on this square
                const newBoard = board | (1 << j);
                callback(newBoard);
                generatePositions(newBoard, maxPieces - 1, (pieces) => {
                    callback(pieces);
                });
            }
        }
        return;
    }

    function generatePositions2(board: number, maxPieces: number, callback: (pieces: number) => void, startIndex = 0): void {
        if (maxPieces === 0) {
          return;
        }
      
        // Find the index of the first empty square after the startIndex
        let j = startIndex;
        while (j < 32 && (board & (1 << j)) !== 0) {
          j++;
        }
      
        for (; j < 32; j++) {
          if ((board & (1 << j)) === 0) {
            // Place a piece on this square
            const newBoard = board | (1 << j);
            callback(newBoard);
            generatePositions2(newBoard, maxPieces - 1, callback, j + 1);
          }
        }
    }

    generatePositions2(0, maxPieces, (pieces) => {
        // Call myfunc for each possible arrangement
        //b.getStatsForValue(pieces, kings);
        if (!boards.has(pieces)) {
            boards.add(pieces)
            if (b.persistStatsForValue(db, pieces, Player.WHITE)) hits += 1;
        }
        i++
    });
    //console.log(i)
    return i;
}


function naivePlaythoughTest(db: BloomDatabase | HashMap, depth: number) {
    let c = new CheckersGame();
    for (let moveIndex = 0; moveIndex < 200; moveIndex++) {
        let moves = c.getMoves();
        if (moves.length == 0) return
        let move = naiveMinimax(c, depth, db);
        c = c.makeMove(move);
    }
}


function getMean(numbers: number[]): number {
    const sum = numbers.reduce((a, b) => a + b, 0);
    return sum / numbers.length;
}

function getResults(vals: number[][]) {
    //console.log(vals)
    //let len = vals.length
    let res: number[] = [];
    //for (const r of vals) {
    //    console.log(r)
    for (let i = 0; i < vals[0].length; i++) {
        //console.log(vals[i])
        res.push(getMean(vals.map(l=>l[i])))
    }
    
    return res
    
}


function test() {
    let results = [];
    let start: number;

    function test1() {
        let times: number[][] = [];
        for (let i = 1; i <= 10; i++) {
            let t: number[][] = [];
            //let s: number[] = [];
            for (let j = 0; j < 3; j++) {
                let db = new HashMap();
                start = performance.now();
                let q = generateOpeningBookPositionsTest(db, i);
                t.push([
                    performance.now() - start,
                    db.getSize(),
                    q[0],
                    q[1],
                    q[2]
                ]);
                //s.push(db.getSize())
                //console.log(i, t, db.getSize())
            }
            times.push([i, ...getResults(t)]);
            //console.log(t)
            console.log(times[times.length - 1])
        }
        return times
    }

    function test2() {
        let times: number[][] = [];
        for (let i = 1; i <= 10; i++) {
            let t: number[][] = [];
            //let s: number[] = [];
            for (let j = 0; j < 3; j++) {
                let db = new HashMap();
                start = performance.now();
                let q = generateEndgameDatabaseTest(db, i);
                t.push([
                    performance.now() - start,
                    db.getSize(),
                    q
                ]);
                //s.push(db.getSize())
                //console.log(i, t, db.getSize())
            }
            times.push([i, ...getResults(t)]);
            //console.log(t)
            console.log(times[times.length - 1])
        }
        return times
    }

    function test3() {
        let times: number[][] = [];
        for (let i = 1; i <= 10; i++) {
            let t: number[][] = [];
            //let s: number[] = [];
            for (let j = 0; j < 3; j++) {
                let db = new HashMap();
                start = performance.now();
                let q = naivePlaythoughTest(db, i);
                t.push([
                    performance.now() - start,
                    db.getSize(),
                    //q
                ]);
                //s.push(db.getSize())
                //console.log(i, t, db.getSize())
            }
            times.push([i, ...getResults(t)]);
            //console.log(t)
            console.log(times[times.length - 1])
        }
        return times
    }

    //results.push(test1());
    //results.push(test2());
    results.push(test3());


}
let res = test()
console.log(res)
*/