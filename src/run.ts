import { minimax, evaluateBoard } from "./ai";
import { CheckersGame } from "./checkers";
import { BoardDatabase, BoardStats, GenerationParams, Move, Player, Status, TrainingParams, WeightSet } from "./types";
import { getPopulationMatches, printBoard, boardStatsDatabase, generateKey, STANDARD_TRAINING_PATTERNS, checkDraw } from "./helper";
import { Population } from "./population";
import SingletonPool from 'node-multiprocess';


/*import boardDB from '../boardDB.json';
console.log('Reading board database json')
let s = performance.now();
export var boardStatsDatabase: BoardDatabase = boardDB;
console.log('Board database json read', performance.now() - s, 'ms')
console.log('saved layouts', Object.keys(boardStatsDatabase).length);*/



export class Checkers {

    private population: Population;
    private moveLimit: number;
    private depth: number;
    //readonly matches: number[][];
    
    //readonly populationSize: number;

    //private moveLimit: number;
    //private depth: number;

    constructor(
        //population: Population = new Population(populationSize),
        //matches: number[][] = getPopulationMatches(populationSize)
        //populationSize: number = 10
    ) {
        //this.populationSize = populationSize;
        //this.population = new Population(populationSize);
        //this.matches = getPopulationMatches(populationSize);
        //this.population.randomiseWeights();
        //this.moveLimit = 100;
        //this.depth = 3;
    }

    //foo(x: number[]) {
    //    return Math.pow(x[0], x[1]);
    //}



    //train(depth: number = this.depth, moveLimit: number = this.moveLimit) {
    train(trainingParams: TrainingParams = {
            standard: true,
            standardMethod: 'RR',
            generations: 5
        }) {


        if (trainingParams.standard) {
            //let method = trainingParams.standardMethod || 'RR'; 
            //this.standardTraining(method, trainingParams.generations);
            this.standardTraining(trainingParams);
        } else {
            this.customTraining(trainingParams);

        }


        //this.moveLimit = trainingParams.moveLimit;
        //this.depth = trainingParams.depth;

        //const population = new Population(populationSize);
        //population.randomiseWeights();
        //console.log(this.population.population)
        //const matches = getPopulationMatches(populationSize);
        //let results: number[] = []; 

        /*this.population = new Population(populationSize);
        this.matches = getPopulationMatches(populationSize);
        this.population.randomiseWeights();
        this.moveLimit = moveLimit;
        this.depth = depth;*

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


        /*for (let i = 0; i < this.matches.length; i++) {
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
        }*/
        
        //for (let i = 0; i < this.population.size; i++) {
        //    console.log(i, this.population.population[i]['score'])
        //}/**/

        //console.log(this.population.getScores())
        
    }

    compete(indexes: number[]) {
        let checkers = new CheckersGame();
        let status = 0;
        let moveIndex = 0;
        //let weights: BoardStats;

        //console.log(indexes)

        const whiteWeights = this.population.population.get(indexes[0])['weights']
        //const whiteWeights = this.population.population[indexes[0]]['weights']
        const blackWeights = this.population.population.get(indexes[1])['weights'];
        //const blackWeights = this.population.population[indexes[1]]['weights'];

        let boardStack: number[][] = [];
        let nonManMoves: number = 0;

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
            //weights = checkers.player === Player.WHITE ? whiteWeights : blackWeights;
            //let move = minimax(checkers, this.depth, weights);
            //console.log('using weights from', checkers.player === Player.WHITE ? 'white' : 'black')
            let move = minimax(checkers, this.depth, checkers.player === Player.WHITE ? whiteWeights : blackWeights);
            //let move = minimax(checkers, this.depth, whiteWeights, blackWeights);
            checkers = checkers.makeMove(move);

            move.end && checkers.board.king ? nonManMoves++ : nonManMoves = 0;
            boardStack.push([checkers.board.white, checkers.board.black, checkers.board.king]);
            if (boardStack.length > 5) boardStack.shift();
            if (checkDraw(boardStack, nonManMoves)) break;
            
            
            //console.log('move', moveIndex, checkers.player === Player.WHITE ? 'black' : 'white')
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);

            //console.log(move)
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
            //console.log('white eval', evaluateBoard(checkers, whiteWeights))
            //console.log('black eval', evaluateBoard(checkers, blackWeights))
            moveIndex++;
        }
    
        printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
        return 0;
    }

    //standardTraining(method: string, generations: number = 10) {
    standardTraining(trainingParams: TrainingParams) {

        const { standardMethod = 'RR',
            depth = undefined,
            moveLimit = 150,
            generations = 10,
            populationSize = undefined,
            competitionType = 0,
            selectionMethod = 0,
            mutationVariance = undefined,
            selectionPercent = undefined,
            keepTopPercent = undefined,
            populationSizePattern = undefined } = trainingParams;

        const pattern = STANDARD_TRAINING_PATTERNS[standardMethod];

        let matches: number[][];
        this.moveLimit = moveLimit;
        //let moveLimit: number;
        //let depth: number;
        //let population: Population;

        let testScores: number[] = [];

        for (let gen=0; gen<generations; gen++) {
            console.log(`generation ${gen+1}/${generations}`)
            this.population = new Population(pattern[gen].populationSize);
            this.depth = pattern[gen].depth;
            //this.population.randomiseWeights();
            testScores.push(this.testPopulation());
            matches = getPopulationMatches(pattern[gen].populationSize);
            //this.moveLimit = trainingParams.moveLimit;
            let value: WeightSet;
            let index: number;
            

            for (let j = 0; j < matches.length; j++) {
                //console.log(`match ${j+1}/${matches.length}`)
                let index1 = matches[j][0];
                let index2 = matches[j][1];
                let status = this.compete([index1, index2]);
                if (status === 0) {
                    value = this.population.population.get(index1);
                    value['score'] += 0.5;
                    this.population.population.set(index1, value);
                    value = this.population.population.get(index2);
                    value['score'] += 0.5;
                    this.population.population.set(index2, value);
                    //console.log('draw', index1, index2)
                } else {
                    index = status === 1 ? index1 : index2;
                    value = this.population.population.get(index);
                    value['score'] += 1;
                    this.population.population.set(index, value);
                }
                /*switch (status) {
                    case 1: //white won
                        //this.population.population[index1]['score'] += 1;
                        index = index1;
                        value = this.population.population.get(index1);
                        value['score'] += 1;
                        //this.population.population.set(index1, value);
                        console.log('white won', index1, index2)
                        break;
                    case 2: //black won
                        //this.population.population[index2]['score'] += 1;
                        index = index2;
                        value = this.population.population.get(index2);
                        value['score'] += 1;
                        console.log('black won', index1, index2)
                        break;
                    case 0: //draw
                        this.population.population[index1]['score'] += 0.5;
                        this.population.population[index2]['score'] += 0.5;
                        console.log('draw', index1, index2)
                        break;
                }*/
                //this.population.population.set(index, value);
            }
            console.log(this.population.getScores())
            this.population.nextGeneration({ size: pattern[Math.min(10, gen+1)].populationSize });
            //console.log(population.getScores())
        }
        testScores.push(this.testPopulation());
        console.log(testScores)
    }
        

    customTraining(trainingParams: TrainingParams) {
        const { depth = 5,
            moveLimit = 150,
            generations = 10,
            populationSize = 50,
            competitionType = 0,
            selectionMethod = 0,
            mutationVariance = undefined,
            selectionPercent = undefined,
            keepTopPercent = undefined,
            populationSizePattern = undefined } = trainingParams;

        this.population = new Population(populationSize);
    }

    testPopulation(): number {
        console.log('testing population')
        let score = 0;
        let matches: number[][] = [];
        let _depth = this.depth;
        this.depth = 5;
        for (let i = 0; i < this.population.size; i++) {
            matches.push([-1, i]);
            matches.push([i, -1]);
        }

        for (let j = 0; j < matches.length; j++) {
            let index1 = matches[j][0];
            let index2 = matches[j][1];
            let status = this.compete([index1, index2]);
            switch (status) {
                case 1: //white won
                    if (index1 == -1) score += 1;
                    break;
                case 2: //black won
                    if (index2 == -1) score += 1;
                    break;
                case 0: //draw
                    score += 0.5;
                    break;
            }
        }

        this.depth = _depth;

        console.log('test score', score)
        return score;

    }


    generateOpeningBookPositions(depth: number) { //TODO remove

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
        //saveBoardStatsDatabase(database, `positionStatDB_${depth}.json`)

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


/*
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


    

    for (let i = 0; i < matches.length; i++) {
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
    }
    
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
}*/

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


