import { Board } from "./board";
import { CheckersGame } from "./checkers";
import { BloomDatabase, HashMap } from "./database";
import { generateKeyComplete, getPieceCount, getWeights, printBoard, randomNeg, roundTo, writeToFile } from "./helper";
import { BoardStats, Move, Player, TrainedBot, WeightInit, WeightSet } from "./types";

export var EvalHit: number = 0;
export var EvalMiss: number = 0;

const MAX_EVAL = 1000000;
var evaluatedNodeCountThisMove = 0;

// minimax function for finding the best move from a given position
export function minimax(checkers: CheckersGame, depth: number, population: Map<number, WeightSet>, index: number, db: BloomDatabase | HashMap): Move {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove!: Move;

    const member = population.get(index)!;
    evaluatedNodeCountThisMove = 0;

    const moves = checkers.getMoves();
    if (moves.length == 1) {
        return moves[0];
    }
  
    for (const move of moves) { 
        const next = checkers.makeMove(move);
        let evaluation: number;

        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        try {
            let e = searchDB(key, member, depth)
            if (e) {
                evaluation = checkers.player == Player.WHITE ? e : -e;
                EvalHit++;
            } else {
                evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member, db)
                let evaluationWhite = checkers.player == Player.WHITE ? evaluation : -evaluation;
                member.evaluationDB[key] = {eval: evaluationWhite, depth: depth}
                EvalMiss++;
            }

            evaluatedNodeCountThisMove++;

            if (evaluation >= bestScore) {
                bestScore = evaluation;
                bestMove = move;
            }
        } catch (error) {
            console.log('error', error)
        }


    }
    return bestMove;
}


export function getBestMoveTrainedBot(checkers: CheckersGame, depth: number, bot: TrainedBot, db: BloomDatabase | HashMap): { move: Move, evaluatedNodeCount: number, evaluation: number } {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove: Move;

    evaluatedNodeCountThisMove = 0;

    console.log("searching at depth", depth)

    const moves = checkers.getMoves();
    if (moves.length == 1) {
        return { move: moves[0], evaluatedNodeCount: 1, evaluation: -999 };
    }
  
    for (const move of moves) {

        const next = checkers.makeMove(move);
        let evaluation: number;
        
        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        let e = searchDB(key, bot, depth)
        if (e) {
            evaluation = checkers.player == Player.WHITE ? e : -e;
            EvalHit++;
        } else {
            evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot, db)

            let evaluationWhite = checkers.player == Player.WHITE ? evaluation : -evaluation;
            bot.evaluationDB[key] = {eval: evaluationWhite, depth: depth}
            EvalMiss++;
        }
       
        if (evaluation >= bestScore) {
            bestScore = evaluation;
            bestMove = move;
        }
    }
    console.log('evaluated nodes', evaluatedNodeCountThisMove)
    return { move: bestMove!, evaluatedNodeCount: evaluatedNodeCountThisMove, evaluation: bestScore };
}

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
        let evaluation: number = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, emptyWeights, db, true);
        if (evaluation >= bestScore) {
            bestScore = evaluation;
            bestMove = move;
        }
    }
    return bestMove;
}


function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, bot: WeightSet | TrainedBot, db: BloomDatabase | HashMap, naive: boolean = false): number {

    if (depth === 0) return quiescenceSearch(checkers, alpha, beta, bot.weights, db, naive);

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
            evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, bot, db, naive)
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
}


function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, weights: BoardStats, db: BloomDatabase | HashMap, naive?: boolean) {

    const moves = checkers.getMoves();
    
    if (moves.length == 0) {
        evaluatedNodeCountThisMove++;
        return (MAX_EVAL / 2)
    }

    const evaluation = naive ? evaluateBoardNaive(checkers, db) : evaluateBoard(checkers, weights!, db);

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

    for (let i = 0; i < BOARD_STAT_COUNT; i++) {
        const key = keys[i];
        if (stats[key] === 0) continue;
        const multiplier: number = stats[key] / checkers.bestBoard[key];
        if (!Number.isFinite(multiplier)) continue;
        score += weights[key] * multiplier;
    }

    if (score === 0) return 0;
    score *= (PIECE_COUNT_CONSTANT / pieceCount);

    return checkers.player == Player.BLACK ? score : -score;
}


export function evaluateBoardNaive(checkers: CheckersGame, db: BloomDatabase | HashMap = new HashMap(), getStats: boolean = true): number {
    if (getStats) {
        const p = checkers.player === Player.WHITE ? checkers.board.black : checkers.board.white;
        checkers.board.persistStatsForValue(db, p, checkers.player)
        return 0;
    } else {
        let score = getPieceCount(checkers.board.white) - getPieceCount(checkers.board.black);
        return checkers.player == Player.BLACK ? score : -score;
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