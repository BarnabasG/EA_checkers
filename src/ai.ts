import { CheckersGame } from "./checkers";
import { getBoardFomBin, getPieceCount, printBoard } from "./helper";
import { BoardStats, Move, Player, PopulationSet } from "./types";



//export function minimax(checkers: CheckersGame, depth: number, whiteWeights: BoardStats, blackWeights: BoardStats, evaluatingPlayer: Player): Move {
//export function minimax(checkers: CheckersGame, depth: number, whiteWeights: BoardStats, blackWeights: BoardStats): Move {
export function minimax(checkers: CheckersGame, depth: number, weights: BoardStats): Move {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove: Move;// = { start: 0, end: 0, captures: 0 };
    //printBoard(checkers.board.white, checkers.board.black, checkers.board.king)
    //console.log(weights)

    var evaluations = [];
  
    for (const move of checkers.getMoves()) { 
        const next = checkers.makeMove(move);
        //const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, whiteWeights, blackWeights, evaluatingPlayer == Player.WHITE ? Player.BLACK : Player.WHITE);
        //const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, whiteWeights, blackWeights);
        const evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, weights);
        evaluations.push([move, evaluation]);
        if (evaluation >= bestScore) {
            //console.log('new best move', evaluation)
            bestScore = evaluation;
            bestMove = move;
        }
    }
    return bestMove;
}


function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, weights: BoardStats) {
//function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, whiteWeights: BoardStats, blackWeights: BoardStats, evaluatingPlayer: Player) {
//function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, whiteWeights: BoardStats, blackWeights: BoardStats) {

    if (depth === 0) return quiescenceSearch(checkers, alpha, beta, weights);
    //if (depth === 0) return quiescenceSearch(checkers, alpha, beta, whiteWeights, blackWeights, evaluatingPlayer);
    //if (depth === 0) return quiescenceSearch(checkers, alpha, beta, whiteWeights, blackWeights);

    const moves = checkers.getMoves();

    if (moves.length == 0) {
        return checkers.player === Player.WHITE ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
  
    //for (const move of checkers.getMoves()) {
    for (const move of moves) {
        const next = checkers.makeMove(move);
        const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, weights);
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, whiteWeights, blackWeights, evaluatingPlayer == Player.WHITE ? Player.BLACK : Player.WHITE);
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, whiteWeights, blackWeights);
        if (evaluation >= beta) return beta;
        alpha = Math.max(evaluation, alpha);
    }
  
    return alpha;
}


function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, weights: BoardStats) {
//function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, whiteWeights: BoardStats, blackWeights: BoardStats, evaluatingPlayer: Player) {
//function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, whiteWeights: BoardStats, blackWeights: BoardStats) {

    const moves = checkers.getMoves();
    
    if (moves.length == 0) {
        //return checkers.player === Player.WHITE ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        return Number.POSITIVE_INFINITY
    }

    const evaluation = evaluateBoard(checkers, weights);
    //console.log('evaluating player', evaluatingPlayer)
    //console.log('checkers player', checkers.player)
    //const evaluation = evaluateBoard(checkers, checkers.player == Player.WHITE ? whiteWeights : blackWeights);
  
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);
  
    //for (const move of checkers.getMoves()) {
    for (const move of moves) {
        if (getPieceCount(move.captures) === 0) continue;
    
        const next = checkers.makeMove(move);
        const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, weights);
        //const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, whiteWeights, blackWeights, evaluatingPlayer == Player.WHITE ? Player.BLACK : Player.WHITE);
        //const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, whiteWeights, blackWeights);
    
        if (nextEvaluation >= beta) return beta;
        alpha = Math.max(nextEvaluation, alpha);
    }
  
    return alpha;
}


//TODO I think the evaluation function which puts positive as white good, negative as black good,
//is evaluating high scores as good moves for black
export function evaluateBoard(checkers: CheckersGame, weights: BoardStats): number {

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





