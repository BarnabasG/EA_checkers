import { Checkers } from "./checkers";
import { getBoardFomBin, getPieceCount, printBoard } from "./helper";
import { BoardStats, Move, Player, PopulationSet } from "./types";


export function minimax(checkers: Checkers, depth: number, weights: BoardStats): Move {
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove: Move = { start: 0, end: 0, captures: 0 };
  
    for (const move of checkers.getMoves()) { 
        const next = checkers.makeMove(move);
        const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, weights);
        //const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, weights);
        if (evaluation >= bestScore) {
            //console.log('new best move', evaluation)
            bestScore = evaluation;
            bestMove = move;
        }
    }
    return bestMove;
}


function alphaBetaSearch(checkers: Checkers, depth: number, alpha: number, beta: number, weights: BoardStats) {

    if (depth === 0) return quiescenceSearch(checkers, alpha, beta, weights);
  
    for (const move of checkers.getMoves()) {
        const next = checkers.makeMove(move);
        const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, weights);
        if (evaluation >= beta) return beta;
        alpha = Math.max(evaluation, alpha);
    }
  
    return alpha;
}


function quiescenceSearch(checkers: Checkers, alpha: number, beta: number, weights: BoardStats) {

    const evaluation = evaluateBoard(checkers, weights);
  
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);
  
    for (const move of checkers.getMoves()) {
        if (getPieceCount(move.captures) === 0) continue;
    
        const next = checkers.makeMove(move);
        const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, weights);
    
        if (nextEvaluation >= beta) return beta;
        alpha = Math.max(nextEvaluation, alpha);
    }
  
    return alpha;
}

export function evaluateBoard(checkers: Checkers, weights: BoardStats): number {

    let score: number = 0;
    const pieceCount: number = getPieceCount(checkers.board.white | checkers.board.black);
    const stats: BoardStats = checkers.board.getBoardStats();
    let index: number = 0;

    for (const key in stats) {
        index += 1;
        if (stats[key] === 0) continue;
        const multiplier: number = stats[key] / checkers.bestBoard[key];
        if (!Number.isFinite(multiplier)) continue;
        score += weights[key] * multiplier
    }
    score /= index;
    if (!Number.isFinite(score)) score = 0;
    score *= (24 / pieceCount);

    return score;
}




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





