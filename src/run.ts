import { minimax, evaluateBoard } from "./ai";
import { Checkers } from "./checkers";
import { BoardStats, Player, Status } from "./types";
import { saveBoardStatsDatabase, getPopulationMatches, printBoard } from "./helper";
import { Population } from "./population";


export function compete(whiteWeights: BoardStats, blackWeights: BoardStats, moveLimit: number = 100, depth: number = 3) {
    let checkers = new Checkers();
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


export function train(populationSize: number, depth: number = 3, moveLimit: number = 100) {
    
    const population = new Population(populationSize);
    population.randomiseWeights();
    const matches = getPopulationMatches(populationSize);
    //let results: number[] = []; 

    //console.log(matches)

    for (let i = 0; i < matches.length; i++) {
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
    let checkers = new Checkers();
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
    let checkers = new Checkers();
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