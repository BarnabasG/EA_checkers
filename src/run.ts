import { minimax, evaluateBoard } from "./ai";
import { CheckersGame } from "./checkers";
import { BoardDatabase, BoardStats, Move, Player, Status } from "./types";
import { saveBoardStatsDatabase, getPopulationMatches, printBoard, boardStatsDatabase, generateKey } from "./helper";
import { Population } from "./population";
import SingletonPool from 'node-multiprocess';


/*import boardDB from '../boardDB.json';
console.log('Reading board database json')
let s = performance.now();
export var boardStatsDatabase: BoardDatabase = boardDB;
console.log('Board database json read', performance.now() - s, 'ms')
console.log('saved layouts', Object.keys(boardStatsDatabase).length);*/

export class Checkers {

    readonly population: Population;
    readonly matches: number[][];
    
    readonly populationSize: number;

    private moveLimit: number;
    private depth: number;

    constructor(
        //population: Population = new Population(populationSize),
        //matches: number[][] = getPopulationMatches(populationSize)
        populationSize: number = 10
    ) {
        this.populationSize = populationSize;
        this.population = new Population(populationSize);
        this.matches = getPopulationMatches(populationSize);
        this.population.randomiseWeights();
        this.moveLimit = 100;
        this.depth = 3;
    }

    //foo(x: number[]) {
    //    return Math.pow(x[0], x[1]);
    //}




    train(depth: number = this.depth, moveLimit: number = this.moveLimit) {
        this.moveLimit = moveLimit;
        this.depth = depth;

        //const population = new Population(populationSize);
        //population.randomiseWeights();
        console.log(this.population.population)
        //const matches = getPopulationMatches(populationSize);
        //let results: number[] = []; 

        //console.log(matches)

        //const Pool = require('multiprocessing').Pool;
        //const pool = new Pool(4);
        //pool.map([this.matches], this.foo, {onResult: val => { results.push(val) }})

        //console.log(results)

        //let results: number[][] = [];
        //SingletonPool.setMaxProcesses(4);

        //const pool = SingletonPool.getInstance();

        //let promises = []
        //for (const match of matches) {
            //pool.exec(compete, [population.population[match[0]]['weights'], population.population[match[1]]['weights'], moveLimit, depth])
            //    .then((result: number) => {
            //        results.push([result])
            //    })
            //promises.push(pool.addJob(compete, population.population[match[0]]['weights'], population.population[match[1]]['weights'], moveLimit, depth))
        //}

        //const promisesResults = await Promise.all(promises);
        //promisesResults.forEach(result => console.log(result));


        for (let i = 0; i < this.matches.length; i++) {
            console.log(`match ${i+1}/${this.matches.length}`)
            let index1 = this.matches[i][0];
            let index2 = this.matches[i][1];
            //let status = compete(this.population.population[index1]['weights'], this.population.population[index2]['weights'], moveLimit, depth);
            let status = this.compete([index1, index2]);
            if (status === 1) {
                this.population.population[index1]['score'] += 1;
                console.log('white won', index1, index2)
            } else if (status === 2) {
                this.population.population[index2]['score'] += 1;
                console.log('black won', index1, index2)
            } else if (status === 0) {
                this.population.population[index1]['score'] += 0.5;
                this.population.population[index2]['score'] += 0.5;
                console.log('draw', index1, index2)
            }
        }
        
        //for (let i = 0; i < this.population.size; i++) {
        //    console.log(i, this.population.population[i]['score'])
        //}/**/

        console.log(this.population.getScores())
        
    }

    compete(indexes: number[]) {
        let checkers = new CheckersGame();
        let status = 0;
        let moveIndex = 0;
        let weights: BoardStats;
        const whiteWeights = this.population.population[indexes[0]]['weights']
        const blackWeights = this.population.population[indexes[1]]['weights'];

        //console.log(whiteWeights, blackWeights)
    
        while (moveIndex <= this.moveLimit) {
            //console.log('move', moveIndex, checkers.player === Player.WHITE ? 'white' : 'black')
            let moves = checkers.getMoves();
            status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
            if (status !== 0) {
                //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
                //console.log('Game Over', moveIndex, status, Status[status]);
                return status;
            }
            //console.log(`${moves.length} moves found (turn ${moveIndex})`)
            //weights = checkers.player === Player.WHITE ? checkers.population.population[index1]['weights'] : checkers.population.population[index2]['weights'];
            weights = checkers.player === Player.WHITE ? whiteWeights : blackWeights;
            let move = minimax(checkers, this.depth, weights);
            checkers = checkers.makeMove(move);
            //console.log(move)
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
            //console.log('white eval', evaluateBoard(checkers, whiteWeights))
            //console.log('black eval', evaluateBoard(checkers, blackWeights))
            moveIndex++;
        }
    
        return 0;
    }


    generateOpeningBookPositions(depth: number) {

        let checkers = new CheckersGame();
        let database: BoardDatabase = {};
        let whiteKey: string;
        let blackKey: string;

        let s = performance.now();

        function getNextMoves(checkers: CheckersGame, depth: number) {
            if ( depth === 0 ) return

            for (const move of checkers.getMoves()) {
                const newCheckers = checkers.makeMove(move);
                let whiteKey = generateKey(newCheckers.board.white, newCheckers.board.white & newCheckers.board.king);
                let blackKey = generateKey(newCheckers.board.black, newCheckers.board.black & newCheckers.board.king);
                if (!database[whiteKey]) database[whiteKey] = newCheckers.board.getBoardStatsForColour(newCheckers.board.white, newCheckers.board.white & newCheckers.board.king, Player.WHITE);
                if (!database[blackKey]) database[blackKey] = newCheckers.board.getBoardStatsForColour(newCheckers.board.black, newCheckers.board.black & newCheckers.board.king, Player.BLACK);
                getNextMoves(newCheckers, depth - 1);
            }
        }

        whiteKey = generateKey(checkers.board.white, checkers.board.white & checkers.board.king);
        database[whiteKey] = checkers.board.getBoardStatsForColour(checkers.board.white, checkers.board.king, Player.WHITE);
        blackKey = generateKey(checkers.board.black, checkers.board.black & checkers.board.king);
        database[blackKey] = checkers.board.getBoardStatsForColour(checkers.board.black, checkers.board.king, Player.BLACK);
        getNextMoves(checkers, depth)

        console.log(`${Object.keys(database).length} boards saved in ${performance.now() - s}ms`)
        saveBoardStatsDatabase(database, `positionStatDB_${depth}.json`)

    }


    /*generateOpeningBook(depth: number) {

        let checkers = new CheckersGame();
        let database: BoardDatabase = {};
        let key: string;

        let s = performance.now();

        function getNextMoves(checkers: CheckersGame, depth: number) {
            if ( depth === 0 ) return

            for (const move of checkers.getMoves()) {
                const newCheckers = checkers.makeMove(move);
                key = generateKey(newCheckers.board.white, newCheckers.board.black, newCheckers.board.king)
                if (!database[key]) database[key] = newCheckers.board.getBoardStats()
                getNextMoves(newCheckers, depth - 1);
            }
        }

        key = generateKey(checkers.board.white, checkers.board.black, checkers.board.king)
        database[key] = checkers.board.getBoardStats()
        getNextMoves(checkers, depth)

        console.log(`${Object.keys(database).length} boards saved in ${performance.now() - s}ms`)
        saveBoardStatsDatabase(database, `boardDB_${depth}.json`)

    }*/


}



export function compete1(whiteWeights: BoardStats, blackWeights: BoardStats, moveLimit: number = 100, depth: number = 3) {
    let checkers = new CheckersGame();
    let status = 0;
    let moveIndex = 0;
    let weights: BoardStats;

    while (moveIndex <= moveLimit) {
        //console.log('move', moveIndex, checkers.player === Player.WHITE ? 'white' : 'black')
        let moves = checkers.getMoves();
        status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
        if (status !== 0) {
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
            //console.log('Game Over', moveIndex, status, Status[status]);
            return status;
        }
        //console.log(`${moves.length} moves found (turn ${moveIndex})`)
        //weights = checkers.player === Player.WHITE ? checkers.population.population[index1]['weights'] : checkers.population.population[index2]['weights'];
        weights = checkers.player === Player.WHITE ? whiteWeights : blackWeights;
        let move = minimax(checkers, depth, weights)
        checkers = checkers.makeMove(move);
        //console.log(move)
        //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
        moveIndex++;
    }

    return 0;
}

//let population = new Population(10);
//compete(population.population[0]['weights'], population.population[1]['weights'], 100, 3)


export function train1(populationSize: number, depth: number = 3, moveLimit: number = 100) {
    
    const population = new Population(populationSize);
    population.randomiseWeights();
    console.log(population.population)
    const matches = getPopulationMatches(populationSize);
    //let results: number[] = []; 

    //console.log(matches)

    //const Pool = require('multiprocessing').Pool;
    //const pool = new Pool(4);
    //pool.map([matches], compete, {onResult: val => { results.push([val]) }})

    let results: number[][] = [];
    SingletonPool.setMaxProcesses(4);

    const pool = SingletonPool.getInstance();

    let promises = []
    for (const match of matches) {
        //pool.exec(compete, [population.population[match[0]]['weights'], population.population[match[1]]['weights'], moveLimit, depth])
        //    .then((result: number) => {
        //        results.push([result])
        //    })
        promises.push(pool.addJob(compete1, population.population[match[0]]['weights'], population.population[match[1]]['weights'], moveLimit, depth))
    }

    //const promisesResults = await Promise.all(promises);
    //promisesResults.forEach(result => console.log(result));


    

    /*for (let i = 0; i < matches.length; i++) {
        console.log(`match ${i}/${matches.length}`)
        let index1 = matches[i][0];
        let index2 = matches[i][1];
        let status = compete(population.population[index1]['weights'], population.population[index2]['weights'], moveLimit, depth);
        if (status === 1) {
            population.population[index1]['score'] += 1;
        } else if (status === 2) {
            population.population[index2]['score'] += 1;
        } else if (status === 0) {
            population.population[index1]['score'] += 0.5;
            population.population[index2]['score'] += 0.5;
        }
    }*/
    
    for (let i = 0; i < population.size; i++) {
        console.log(i, population.population[i]['score'])
    }

}


//compete(0, 1, 100, 3);


// initialise population outside of checkers() class, new checkers() per match



export function minimaxGame(moveLimit: number = 100) {
    //boardStatsDatabase = getBoardStatsDatabase();
    let checkers = new CheckersGame();
    let status = 0;
    let index = 0;

    while (index <= moveLimit) {
        //checkers.bestBoard = checkers.updateBoardStats();
        let moves = checkers.getMoves();
        status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
        if (status !== 0) {
            console.log('Game Over', index, status, Status[status]);
            return status;
        }
        let move = minimax(checkers, 3, {});
        //console.log(move)
        checkers = checkers.makeMove(move);
        index++;
    }
    //console.log('Game Over (move limit reached)', index, status, Status[status]);
    saveBoardStatsDatabase();
    return status;
}

/*
export function randomGame(moveLimit: number = 100) {
    //boardStatsDatabase = getBoardStatsDatabase();
    let checkers = new CheckersGame();
    let status = 0;
    let index = 0;

    printBoard(checkers.board);
    console.log(checkers.board.getBoardStats())

    while (index <= moveLimit) {
        //checkers.bestBoard = checkers.updateBoardStats();
        let moves = checkers.getMoves();
        status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
        if (status !== 0) {
            console.log('Game Over', index, status, Status[status]);
            return status;
        }
        checkers = checkers.makeMove(getRandom(moves));
        console.log('Move', index, checkers.player, Status[status]);
        index++;
        printBoard(checkers.board);
        console.log(checkers.board.getBoardStats())
        console.log('eval', evaluateBoard(checkers, {}))
    }
    console.log('Game Over (move limit reached)', index, status, Status[status]);
    saveBoardStatsDatabase();
    return status;
}

*/


