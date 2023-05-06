import { naiveMinimax } from "./ai"
import { Board } from "./board"
import { CheckersGame } from "./checkers"
import { BloomFilter, BoardStats, HashTable, Player } from "./types"

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

    console.log("Generating database...")
    generateOpeningBookPositions(db, openingDepth);
    console.log(`${db.getSize() - lengthBefore} boards saved after opening book`)
    naivePlaythough(db, gameDepth);
    console.log(`${db.getSize() - lengthBefore} boards saved after naive game`)
    generateEndgameDatabase(db, maxPieces);
    
    console.log(`${db.getSize() - lengthBefore} boards saved after endgame database`)
}

// Generate positions stemming from the opening position of play
function generateOpeningBookPositions(db: BloomDatabase | HashMap, openingDepth: number): void {

    let checkers = new CheckersGame();

    function getNextMoves(checkers: CheckersGame, depth: number) {
        if ( depth === 0 ) return

        for (const move of checkers.getMoves()) {
            const newCheckers = checkers.makeMove(move);
            const p = newCheckers.player === Player.WHITE ? newCheckers.board.black : newCheckers.board.white;
            newCheckers.board.persistStatsForValue(db, p, newCheckers.player === Player.WHITE ? Player.BLACK : Player.WHITE)
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