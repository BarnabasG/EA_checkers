import { Board } from "./board";
import { Checkers } from "./checkers";
import { getPieceCount } from "./helper";
import { Move, Player } from "./types";


export function minimax(checkers: Checkers, depth: number) {
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove: Move = { start: 0, end: 0, captures: 0 };
  
    for (const move of checkers.getMoves()) {
        const next = checkers.makeMove(move);
        const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        if (evaluation >= bestScore) {
            bestScore = evaluation;
            bestMove = move;
        }
    }
    return bestMove;
}


function alphaBetaSearch(checkers: Checkers, depth: number, alpha: number, beta: number) {
    if (depth === 0) return quiescenceSearch(checkers, alpha, beta);
  
    for (const move of checkers.getMoves()) {
        const next = checkers.makeMove(move);
        const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha);
        if (evaluation >= beta) return beta;
        alpha = Math.max(evaluation, alpha);
    }
  
    return alpha;
}


function quiescenceSearch(checkers: Checkers, alpha: number, beta: number) {
    const evaluation = evaluateBoard(checkers);
  
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);
  
    for (const move of checkers.getMoves()) {
        if (getPieceCount(move.captures) === 0) continue;
    
        const next = checkers.makeMove(move);
        const nextEvaluation = -quiescenceSearch(next, -beta, -alpha);
    
        if (nextEvaluation >= beta) return beta;
        alpha = Math.max(nextEvaluation, alpha);
    }
  
    return alpha;
}

//function evaluateBoard(checkers: Checkers, maximizingPlayer: boolean): number {
function evaluateBoard(checkers: Checkers): number {
    const player = checkers.player === Player.WHITE
        ? checkers.board.white
        : checkers.board.black;
    const opponent = checkers.player === Player.WHITE
        ? checkers.board.black
        : checkers.board.white;

    let evaluation = 0;

    evaluation += getPieceCount(player);
    evaluation += getPieceCount(player & checkers.board.king);
    evaluation -= getPieceCount(opponent);
    evaluation -= getPieceCount(opponent & checkers.board.king);

    return evaluation;
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


