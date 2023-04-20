import { naiveMinimax } from "./ai"
import { Board } from "./board"
import { CheckersGame } from "./checkers"
import { BloomFilter, BoardStats, HashTable, Player } from "./types"


/*export class boardStatsDB {
    public boardStatsDatabase: BloomHashMapBoardStats = new BloomHashMapBoardStats();
    public generated: boolean = false;

    clearBoardDB() {
        this.boardStatsDatabase = new BloomHashMapBoardStats();
    }

    generateDatabase(openingDepth: number = 8, gameDepth: number = 9, maxPieces = 4): void {

        let lengthBefore: number = this.boardStatsDatabase.getSize();

        this.generateOpeningBookPositions(openingDepth);
        //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved in opening book`)
        console.log(`${this.boardStatsDatabase.getSize() - lengthBefore} boards saved after opening book`)
        this.naivePlaythough(gameDepth);
        //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved in naive game`)
        console.log(`${this.boardStatsDatabase.getSize() - lengthBefore} boards saved after naive game`)
        this.generateEndgameDatabase(maxPieces);
        
        //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved`)
        console.log(`${this.boardStatsDatabase.getSize() - lengthBefore} boards saved after endgame database`)
    }


    generateOpeningBookPositions(openingDepth: number): void {

        let checkers = new CheckersGame();

        function getNextMoves(checkers: CheckersGame, depth: number) {
            if ( depth === 0 ) return

            for (const move of checkers.getMoves()) {
                const newCheckers = checkers.makeMove(move);
                //newCheckers.board.getBoardStats(true, false);
                const p = newCheckers.player === Player.WHITE ? newCheckers.board.black : newCheckers.board.white;
                newCheckers.board.persistStatsForValue(p, newCheckers.player === Player.WHITE ? Player.BLACK : Player.WHITE)
                //console.log(boardStatsDatabase.size)
                getNextMoves(newCheckers, depth - 1);
            }
        }

        checkers.board.persistStatsForValue(checkers.board.white, Player.WHITE);
        getNextMoves(checkers, openingDepth)

    }

    naivePlaythough(depth: number) {
        let c = new CheckersGame();
        for (let moveIndex = 0; moveIndex < 200; moveIndex++) {
            let moves = c.getMoves();
            if (moves.length == 0) return
            let move = naiveMinimax(c, depth);
            c = c.makeMove(move);
        }
    }


    generateEndgameDatabase(maxPieces: number): void {
        let i = 0;
        let b = new Board();

        function generatePositions(board: number, maxPieces: number, callback: (pieces: number) => void): void {
            if (maxPieces === 0) {
                return;
            }
            for (let i = 0; i < 32; i++) {
                if ((board & (1 << i)) === 0) {
                    // Place a piece on this square
                    const newBoard = board | (1 << i);
                    callback(newBoard);
                    generatePositions(newBoard, maxPieces - 1, (pieces) => {
                        callback(pieces);
                    });
                }
            }
            return;
        }

        generatePositions(0, maxPieces, (pieces) => {
            // Call myfunc for each possible arrangement
            //b.getStatsForValue(pieces, kings);
            b.persistStatsForValue(pieces, Player.WHITE);
            i++
        });
        console.log(i)
    }
}*/

/*export var boardStatsDatabase: BloomHashMapBoardStats = new BloomHashMapBoardStats();

export function clearBoardDB() {
    boardStatsDatabase = new BloomHashMapBoardStats();
}*/


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

export function generateDatabase(db: BloomDatabase | HashMap, openingDepth: number, gameDepth: number = 9, maxPieces = 4): void {

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

function naivePlaythough(db: BloomDatabase | HashMap, depth: number) {
    let c = new CheckersGame();
    for (let moveIndex = 0; moveIndex < 200; moveIndex++) {
        let moves = c.getMoves();
        if (moves.length == 0) return
        let move = naiveMinimax(c, depth, db);
        c = c.makeMove(move);
    }
}


function generateEndgameDatabase(db: BloomDatabase | HashMap, maxPieces: number): void {
    let i = 0;
    let b = new Board();

    function generatePositions(board: number, maxPieces: number, callback: (pieces: number) => void): void {
        if (maxPieces === 0) {
            return;
        }
        for (let i = 0; i < 32; i++) {
            if ((board & (1 << i)) === 0) {
                // Place a piece on this square
                const newBoard = board | (1 << i);
                callback(newBoard);
                generatePositions(newBoard, maxPieces - 1, (pieces) => {
                    callback(pieces);
                });
            }
        }
        return;
    }

    generatePositions(0, maxPieces, (pieces) => {
        // Call myfunc for each possible arrangement
        //b.getStatsForValue(pieces, kings);
        b.persistStatsForValue(db, pieces, Player.WHITE);
        i++
    });
    //console.log(i)
}