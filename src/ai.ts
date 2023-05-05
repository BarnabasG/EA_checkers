import { Board } from "./board";
import { CheckersGame } from "./checkers";
import { BloomDatabase, HashMap } from "./database";
import { generateKeyComplete, getBoardFomBin, getPieceCount, getWeights, printBoard, randomNeg, roundTo, writeToFile } from "./helper";
import { Population } from "./population";
import { BoardStats, Evaluations, Move, Player, TrainedBot, WeightInit, WeightSet } from "./types";

export var EvalHit: number = 0;
export var EvalMiss: number = 0;

const MAX_EVAL = 1000000;

//var boardStack: number[][] = [];

//export function minimax(checkers: CheckersGame, depth: number, whiteWeights: BoardStats, blackWeights: BoardStats, evaluatingPlayer: Player): Move {
//export function minimax(checkers: CheckersGame, depth: number, whiteWeights: BoardStats, blackWeights: BoardStats): Move {
//export function minimax(checkers: CheckersGame, depth: number, weights: BoardStats, evaluationDB: evaluations): Move {
    
var evaluatedNodeCountThisMove = 0;
//var searchDepth = 0;

var debugFlag = false;
var debugged = true;

export function minimax(checkers: CheckersGame, depth: number, population: Map<number, WeightSet>, index: number, db: BloomDatabase | HashMap): Move {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove!: Move;// = { start: 0, end: 0, captures: 0 };
    //printBoard(checkers.board.white, checkers.board.black, checkers.board.king)
    //console.log(weights)

    //var evaluations = [];

    //let scores: any[][] = []; //

    const member = population.get(index)!;
    //const weights = member.weights;

    evaluatedNodeCountThisMove = 0;
    //searchDepth = depth;
    //let evaluatedNodeCountThisMove = 0;

    //let maximisingPlayer = checkers.player

    const moves = checkers.getMoves();

    if (moves.length == 1) {
        return moves[0];
    }
  
    for (const move of moves) { 
        const next = checkers.makeMove(move);
        //const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, whiteWeights, blackWeights, evaluatingPlayer == Player.WHITE ? Player.BLACK : Player.WHITE);
        //const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, whiteWeights, blackWeights);

        let evaluation: number;

        //evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights, naive);

        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        try {
            let e = searchDB(key, member, depth)
            //let debug = false
            if (e) {
                /*console.log(Player[checkers.player])
                printBoard(next.board.white, next.board.black, next.board.king)
                debug = true
                console.log(Player.WHITE ? e : -e);
                evaluation = checkers.player == Player.WHITE ? e : -e;
                console.log("evaluation read", evaluation)
                console.log(key, member.weights, depth)
                if (key in member.evaluationDB) {
                    if (member.evaluationDB[key]!.depth >= depth) {
                        console.log("evaluation found", member.evaluationDB[key])
                        console.log(member.evaluationDB[key])
                    }
                }*/
                evaluation = checkers.player == Player.WHITE ? e : -e;
                EvalHit++;
            } else {
                evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member, db)
                let evaluationWhite = checkers.player == Player.WHITE ? evaluation : -evaluation;
                //if (debug) console.log("evaluation generated", evaluation)
                member.evaluationDB[key] = {eval: evaluationWhite, depth: depth}
                EvalMiss++;
            }

            /*if (key in population.get(index)!.evaluationDB) {
            //if (member.evaluationDB.has(key)) {
                if (member.evaluationDB[key]!.depth >= depth) {
                    evaluation =  population.get(index)!.evaluationDB[key]!.eval
                    //checkers.evaluatedNodeCount++;
                    //evaluatedNodeCountThisMove++;
                    EvalHit++;
                } else {
                    evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member);
                    //evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights);
                    //let e  = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights, maximisingPlayer);
                    //depth % 2 == 0 ? evaluation = e : evaluation = -e;
                    //evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, population, index);
                    member.evaluationDB[key] = {eval: evaluation, depth: depth}
                    //evaluatedNodeCountThisMove++;
                    EvalMiss++;
                } 
            } else {
                evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member);
                //let e  = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights, maximisingPlayer);
                //depth % 2 == 0 ? evaluation = e : evaluation = -e;
                //evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, population, index);
                member.evaluationDB[key] = {eval: evaluation, depth: depth}
                //member.evaluationDB.put(key, {eval: evaluation, depth: depth})
                //population.set(index, member);
                //population.get(index).evaluationDB[key] = {eval: evaluation, depth: depth}
                //console.log('eval miss')
                EvalMiss++;
            }/**/

            evaluatedNodeCountThisMove++;

            if (evaluation >= bestScore) {
                //console.log('new best move', evaluation)
                bestScore = evaluation;
                bestMove = move;
            }
        } catch (error) {
            console.log('error', error)
            console.log('key', key)
            console.log('index', index)
            console.log('member', member)
            console.log('pop indexes', population.keys())
            console.log('member.evaluationDB', member.evaluationDB)
        }


    }
    /*console.log('index', index, index == -2 ? 'goodbot' : '')
    console.log(depth, 'best move', bestMove, bestScore)
    console.log('evaluated nodes', evaluatedNodeCountThisMove)
    console.log('scores', scores)*/
    return bestMove;
}


// TODO Testing
/*
* always -AB from MM, -eval from QS, +eval white, -eval black from AB
* depth even, black to move     - no, AB wrong, QS wrong
* depth odd, black to move      - no, AB wrong, QS correct
* depth even, white to move     - good
* depth odd, white to move      - no, AB wrong, QS correct
*/  

//type evalResult = {evaluation: number, line: Move[]}

//export function getBestMoveTrainedBot(checkers: CheckersGame, depth: number, bot: TrainedBot, db: BloomDatabase | HashMap): { move: Move, evaluatedNodeCount: number, evaluation: number | string, bestResult: evalResult } {    
export function getBestMoveTrainedBot(checkers: CheckersGame, depth: number, bot: TrainedBot, db: BloomDatabase | HashMap): { move: Move, evaluatedNodeCount: number, evaluation: number } {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove: Move;
    //let bestResult: evalResult;

    //var winningLine: Move[] = [];

    evaluatedNodeCountThisMove = 0;

    console.log("searching at depth", depth)

    const moves = checkers.getMoves();
    //console.log('moves', moves)

    if (moves.length == 1) {
        return { move: moves[0], evaluatedNodeCount: 1, evaluation: -999 };
        //return { move: moves[0], evaluatedNodeCount: 1, evaluation: 'nan', bestResult: {evaluation: -99999, line: [moves[0]]} };
    }

    //printBoard(checkers.board.white, checkers.board.black, checkers.board.king)
  
    for (const move of moves) {
        //console.log(move)

        //console.log(getBoardFomBin(move.start|move.end))

        const next = checkers.makeMove(move);
        let evaluation: number;
        //let result: evalResult;

        //console.log('1 step eval', evaluateBoard(next, bot.weights))
        
        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        let e = searchDB(key, bot, depth)
        if (e) {
            evaluation = checkers.player == Player.WHITE ? e : -e;
            EvalHit++;
        } else {
            evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot, db)
            //result = bestPathAB(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot, db, [move], {evaluation: Number.NEGATIVE_INFINITY, line: []})
            //evaluation = res
            //evaluation = result.evaluation;

            //console.log('evaluation', evaluation)
            if (debugFlag) {
                console.log('this one ^')
                debugFlag = false;
            }

            //let line = result.line;
            //console.log('best line', result)

            let evaluationWhite = checkers.player == Player.WHITE ? evaluation : -evaluation;
            bot.evaluationDB[key] = {eval: evaluationWhite, depth: depth}
            EvalMiss++;
        }
       
        if (evaluation >= bestScore) {
            bestScore = evaluation;
            bestMove = move;
            //bestResult = result!;
            //winningLine = [move, ...winningLine];
        }
    }
    //console.log(depth, 'best move', bestMove!, bestScore)
    //console.log('best', bestResult!)
    console.log('evaluated nodes', evaluatedNodeCountThisMove)
    //console.log('scores', scores)
    //return { move: bestMove!, evaluatedNodeCount: evaluatedNodeCountThisMove, evaluation: bestScore, bestResult: bestResult! };
    return { move: bestMove!, evaluatedNodeCount: evaluatedNodeCountThisMove, evaluation: bestScore };
}

/*export function naiveMinimax(checkers: CheckersGame, depth: number) {    

    const moves = checkers.getMoves();
  
    for (const move of moves) { 
        const next = checkers.makeMove(move);
        naiveMinimax(next, depth - 1);
    }
    return
}*/

export function naiveMinimax(checkers: CheckersGame, depth: number, db: BloomDatabase | HashMap): Move {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove!: Move;

    const moves = checkers.getMoves();

    if (moves.length == 1) return moves[0];

    let emptyWeights: WeightSet = {
        weights: {},
        score: 0,
        evaluationDB: {}
    }
  
    for (const move of moves) { 
        const next = checkers.makeMove(move);
        //let evaluation: number = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, {}, true);
        let evaluation: number = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, emptyWeights, db, true);
        if (evaluation >= bestScore) {
            bestScore = evaluation;
            bestMove = move;
        }
    }
    return bestMove;
}/**/


//function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, population: Map<number, WeightSet>, index: number) {
/*function alphaBetaSearch1(checkers: CheckersGame, depth: number, alpha: number, beta: number, weights: BoardStats, naive: boolean = false) {


    if (depth === 0) return quiescenceSearch(checkers, alpha, beta, weights, naive);

    const moves = checkers.getMoves();
    //console.log(depth, moves.length)

    if (moves.length == 0) {
        evaluatedNodeCountThisMove++;
        return MAX_EVAL+depth;
    }
  
    for (const move of moves) {
    //for (const move of moves) {
        const next = checkers.makeMove(move);
        const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, weights, naive);
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, whiteWeights, blackWeights, evaluatingPlayer == Player.WHITE ? Player.BLACK : Player.WHITE);
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, whiteWeights, blackWeights);
        if (evaluation >= beta) return beta;
        alpha = Math.max(evaluation, alpha);
    }
  
    return alpha;
}*/

function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, bot: WeightSet | TrainedBot, db: BloomDatabase | HashMap, naive: boolean = false): number {


    //if (depth >= 10) console.log(depth, "___________________")
    if (depth === 0) return quiescenceSearch(checkers, alpha, beta, bot.weights, db, naive);

    const moves = checkers.getMoves();
    //console.log(depth, moves.length)

    if (moves.length == 0) {
        evaluatedNodeCountThisMove++;
        return MAX_EVAL+depth;
    }
  
    for (const move of moves) {
    //for (const move of moves) {
        //if (depth >= 9) console.log(getBoardFomBin(move.start|move.end))
        const next = checkers.makeMove(move);
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, weights, naive);
        let evaluation: number;
        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        let e = searchDB(key, bot, depth)

        if (e) {
            evaluation = checkers.player == Player.WHITE ? -e : e;
            EvalHit++;
        } else {
            evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, bot, db, naive)
            if (depth >= 5) {
                let evaluationWhite = checkers.player == Player.WHITE ? -evaluation : evaluation;
                bot.evaluationDB[key] = {eval: evaluationWhite, depth: depth}
            }
            EvalMiss++;
        }
        //if (depth >= 10) console.log('evaluation at', depth, evaluation)
        //if (debugFlag) console.log('AB', depth, alpha, beta, printBoard(checkers.board.white, checkers.board.black, checkers.board.king, false))
        if (debugFlag) {
            writeToFile('testingAI.txt', 'AB')
            writeToFile('testingAI.txt', String(evaluation))
            writeToFile('testingAI.txt', String(depth))
            writeToFile('testingAI.txt', String(alpha))
            writeToFile('testingAI.txt', String(beta))
            writePrintBoard(checkers)
            //writeToFile('testingAI.txt', printBoard(checkers.board.white, checkers.board.black, checkers.board.king, false))
        } 

        if (evaluation >= beta) return beta;
        alpha = Math.max(evaluation, alpha);
    }
  
    return alpha;
}


/*function alphaBetaSearchPlay(checkers: CheckersGame, depth: number, alpha: number, beta: number, bot: TrainedBot, db: BloomDatabase | HashMap, winningLine: Move[]): { evaluation: number, moveSequence: Move[] } {
    
    if (depth === 0) return quiescenceSearch(checkers, alpha, beta, bot.weights, db, false);

    const moves = checkers.getMoves();

    if (moves.length == 0) {
        evaluatedNodeCountThisMove++;
        return MAX_EVAL+depth;
    }
  
    for (const move of moves) {
        const next = checkers.makeMove(move);
        let evaluation: number;
        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        let e = searchDB(key, bot, depth)

        if (e) {
            evaluation = checkers.player == Player.WHITE ? -e : e;
            EvalHit++;
        } else {
            //evaluation = -alphaBetaSearchPlay(next, depth - 1, -beta, -alpha, bot, db)
            const res = -alphaBetaSearchPlay(next, depth - 1, -beta, -alpha, bot, db, winningLine)
            evaluation = res.evaluation
            winningLine = res.moveSequence
            if (depth >= 5) {
                let evaluationWhite = checkers.player == Player.WHITE ? -evaluation : evaluation;
                bot.evaluationDB[key] = {eval: evaluationWhite, depth: depth}
            }
            EvalMiss++;
        }

        if (evaluation >= beta) return beta;
        alpha = Math.max(evaluation, alpha);
    }
  
    return alpha;
}*/


function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, weights: BoardStats, db: BloomDatabase | HashMap, naive?: boolean) {

    const moves = checkers.getMoves();
    
    if (moves.length == 0) {
        evaluatedNodeCountThisMove++;
        return (MAX_EVAL / 2)
    }


    //check this isnt flipping eval

    const evaluation = naive ? evaluateBoardNaive(checkers, db) : evaluateBoard(checkers, weights!, db);

    if (debugFlag) {
        writeToFile('testingAI.txt', 'QS')
        writeToFile('testingAI.txt', String(evaluation))
        writeToFile('testingAI.txt', String(alpha))
        writeToFile('testingAI.txt', String(beta))
        writePrintBoard(checkers)
        //writeToFile('testingAI.txt', printBoard(checkers.board.white, checkers.board.black, checkers.board.king, false))
    } 

    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);

    evaluatedNodeCountThisMove++;
  
    for (const move of checkers.getMoves()) {
        if (!move.captures) continue;
    
        const next = checkers.makeMove(move);
        const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, weights, db, naive);

        if (nextEvaluation >= beta) return beta;
        alpha = Math.max(nextEvaluation, alpha);
    }
  
    return alpha;
}


const PIECE_COUNT_CONSTANT = 24;
const BOARD_STAT_COUNT = 11;

export function evaluateBoard(checkers: CheckersGame, weights: BoardStats, db: BloomDatabase | HashMap = new HashMap()): number {
    const pieceCount: number = getPieceCount(checkers.board.white | checkers.board.black);
    const stats: BoardStats = checkers.board.getBoardStats(db);
    let score: number = 0;
    let keys = Object.keys(stats);
    //let index: number = 0;

    for (let i = 0; i < BOARD_STAT_COUNT; i++) {
        const key = keys[i];
        if (stats[key] === 0) continue;
        const multiplier: number = stats[key] / checkers.bestBoard[key];
        if (!Number.isFinite(multiplier)) continue;
        score += weights[key] * multiplier;
        //index += 1;
    }

    if (score === 0) return 0;

    score *= (PIECE_COUNT_CONSTANT / pieceCount);

    if (!debugged) {
        if (roundTo(Math.abs(score), 3) == 3.231) {
            writeToFile('testingAI.txt', "================Found================")
            writeToFile('testingAI.txt', checkers.player)
            writeToFile('testingAI.txt', JSON.stringify(stats))
            writeToFile('testingAI.txt', checkers.player == Player.BLACK ? score : -score)
            writePrintBoard(checkers)
            //writeToFile('testingAI.txt', printBoard(checkers.board.white, checkers.board.black, checkers.board.king, false))
            //writeToFile('testingAI.txt', "================Found================")

            debugFlag = false;
            debugged = true;
        }
    }

    return checkers.player == Player.BLACK ? score : -score;
    //return score 
}

function writePrintBoard(checkers: CheckersGame) {
    let x = printBoard(checkers.board.white, checkers.board.black, checkers.board.king, false)
    for (const line of x) {
        writeToFile('testingAI.txt', line)
    }
}


export function evaluateBoardNaive(checkers: CheckersGame, db: BloomDatabase | HashMap, getStats: boolean = true): number {

    //if (getStats) checkers.board.getBoardStats(true);
    if (getStats) {
        const p = checkers.player === Player.WHITE ? checkers.board.black : checkers.board.white;
        checkers.board.persistStatsForValue(db, p, checkers.player)
        return 0;
    } else {
        let score = getPieceCount(checkers.board.white) - getPieceCount(checkers.board.black);
        return checkers.player == Player.BLACK ? score : -score;
        //return score
    }

}



function searchDB(key: string, bot: WeightSet | TrainedBot, depth: number): number | null {
    if (key in bot.evaluationDB) {
        if (bot.evaluationDB[key]!.depth >= depth) {
            return bot.evaluationDB[key]!.eval
        }
    } 
    return null;
}






/*function bestPathAB(checkers: CheckersGame, depth: number, alpha: number, beta: number, bot: WeightSet | TrainedBot, db: BloomDatabase | HashMap, moveSequence: Move[], bestLine: evalResult): evalResult {

    let bestMove: Move | undefined = undefined;

    //console.log(depth, alpha, beta)

    //if (depth === 0) return {evaluation: quiescenceSearch(checkers, alpha, beta, bot.weights, db), line: moveSequence};
    //if (depth === 0) return quiescenceSearch(checkers, alpha, beta, bot.weights, db)
    if (depth === 0) {
        let e = quiescenceSearch(checkers, alpha, beta, bot.weights, db)
        if (e > bestLine.evaluation) {
            bestLine.evaluation = e
            bestLine.line = moveSequence
        }
        return {evaluation: e, line: bestLine.line}
    } 

    const moves = checkers.getMoves();
    console.log('moves', moves)
    //console.log(depth, moves.length)

    if (moves.length == 0) {
        //console.log(depth, MAX_EVAL+depth, moveSequence)
        evaluatedNodeCountThisMove++;
        if (MAX_EVAL+depth > bestLine.evaluation) {
            bestLine.evaluation = MAX_EVAL+depth
            bestLine.line = moveSequence
        }
        return {evaluation: MAX_EVAL+depth, line: bestLine.line}
    }
  
    for (const move of moves) {
    //for (const move of moves) {
        const next = checkers.makeMove(move);
        console.log('move', depth, move)
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, weights, naive);
        let evaluation: number;
        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        let e = searchDB(key, bot, depth)

        if (e) {
            evaluation = checkers.player == Player.WHITE ? -e : e;
            EvalHit++;
        } else {
            let result = bestPathAB(next, depth - 1, -beta, -alpha, bot, db, [...moveSequence, move], bestLine)
            evaluation = -result.evaluation
            console.log('best line at depth', depth, result)
            if (depth >= 5) {
                let evaluationWhite = checkers.player == Player.WHITE ? -evaluation : evaluation;
                bot.evaluationDB[key] = {eval: evaluationWhite, depth: depth}
            }
        }
        //evaluation = -result.evaluation
        //console.log('res seq', result.line)
        //let newMove = result.move
        //if (newMove) {
        //    moveSequence.push(newMove)
        //}
        //

        //console.log('eval', evaluation, beta, alpha)
        if (evaluation >= beta) {
            //console.log('beta cutoff', depth, moveSequence.length, moveSequence)
            return {
                evaluation: beta,
                line: bestLine.line
            }
            //return beta;
        }
        if (evaluation > alpha) {
            //console.log('new best', depth, moveSequence.length, moveSequence)
            alpha = evaluation;
            bestMove = move;
            //bestMove = move;
        }
    }

    //moveSequence.push(bestMove!);
    //console.log(moveSequence.length, moveSequence)
  
    //return {evaluation: alpha, line: moveSequence};
    //console.log('returning', depth, bestLine, alpha)
    if (alpha < bestLine.evaluation) {
        bestLine.evaluation = alpha
        bestLine.line = [...moveSequence, bestMove!]
    }
    return { evaluation: alpha, line: bestLine.line };
}*/


function testPaths() {
    const white = 0b0000_0000_0000_0000_0001_0001_0001_0000;
    const black = 0b0000_0000_0101_0000_0000_0000_0000_0000;
    let _board = new Board(white, black, 0);

    let checkers = new CheckersGame(_board);
    checkers.player = Player.WHITE;
    //let pop = new Population({testPopulation: true})
    let bot = {
        "weights": getWeights(WeightInit.TRAINED),
        "evaluationDB": {}
    }

    printBoard(white, black, 0)
    for (let i = 0; i < 1; i++) {
        console.log(getBestMoveTrainedBot(checkers, 7, bot, new HashMap()))
    }
}
//testPaths()


//function flipEval(depth: number): number {
//    return depth % 2 === 1 ? 1 : -1;
//}



// TODO Testing
/*
* always -AB from MM, -eval from QS, +eval white, -eval black from AB
* depth even, black to move     - no, AB wrong, QS wrong
* depth odd, black to move      - no, AB wrong, QS correct
* depth even, white to move     - good
* depth odd, white to move      - no, AB wrong, QS correct
*/  






/*
// minimax algorithm with alpha-beta pruning
// as well as depth limiting
export function minimax1(checkers: Checkers, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): { score: number, move: Move | undefined } {
    const moves = checkers.getMoves()//getMoves(board, maximizingPlayer);
    if (depth === 0 || moves.length === 0) {
        let score: number = evaluateBoard(checkers.board, maximizingPlayer);
        return { score: score, move: undefined };
    }

    if (maximizingPlayer) {
        let bestScore: number = -Infinity;
        let bestMove: Move | undefined = undefined;
        for (let i = 0; i < moves.length; i++) {
            const newBoard = checkers.makeMove(moves[i]);
            const s = minimax(newBoard, depth-1, alpha, beta, false);
            if (s.score > bestScore) {
                bestScore = s.score;
                bestMove = moves[i];
            }
            //maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, s.score);
            if (beta <= alpha) {
                break;
            }
        }
        return { score: bestScore, move: bestMove };
    } else {
        let worstScore: number = Infinity;
        let worstMove: Move | undefined = undefined;
        for (let i = 0; i < moves.length; i++) {
            const newBoard = checkers.makeMove(moves[i]);
            const s = minimax(newBoard, depth-1, alpha, beta, true);
            if (s.score > worstScore) {
                worstScore = s.score;
                worstMove = moves[i];
            }
            //maxEval = Math.max(maxEval, eval);
            beta = Math.max(alpha, s.score);
            if (beta <= alpha) {
                break;
            }
        }
        return { score: worstScore, move: worstMove };
    }
}
*/





