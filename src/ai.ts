import { CheckersGame } from "./checkers";
import { generateKeyComplete, getPieceCount, printBoard, randomNeg } from "./helper";
import { BoardStats, Move, Player, TrainedBot, WeightSet } from "./types";

export var EvalHit: number = 0;
export var EvalMiss: number = 0;

const MAX_EVAL = 1000000;

//var boardStack: number[][] = [];

//export function minimax(checkers: CheckersGame, depth: number, whiteWeights: BoardStats, blackWeights: BoardStats, evaluatingPlayer: Player): Move {
//export function minimax(checkers: CheckersGame, depth: number, whiteWeights: BoardStats, blackWeights: BoardStats): Move {
//export function minimax(checkers: CheckersGame, depth: number, weights: BoardStats, evaluationDB: evaluations): Move {
    
var evaluatedNodeCountThisMove = 0;

export function minimax(checkers: CheckersGame, depth: number, population: Map<number, WeightSet>, index: number): Move {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove!: Move;// = { start: 0, end: 0, captures: 0 };
    //printBoard(checkers.board.white, checkers.board.black, checkers.board.king)
    //console.log(weights)

    //var evaluations = [];

    //let scores: any[][] = []; //

    const member = population.get(index)!;
    //const weights = member.weights;

    evaluatedNodeCountThisMove = 0;
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
            if (key in population.get(index)!.evaluationDB) {
            //if (member.evaluationDB.has(key)) {
                if (member.evaluationDB[key]!.depth >= depth) {
                    evaluation =  population.get(index)!.evaluationDB[key]!.eval
                    //checkers.evaluatedNodeCount++;
                    evaluatedNodeCountThisMove++;
                    EvalHit++;
                } else {
                    evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights);
                    //let e  = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights, maximisingPlayer);
                    //depth % 2 == 0 ? evaluation = e : evaluation = -e;
                    //evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, population, index);
                    member.evaluationDB[key] = {eval: evaluation, depth: depth}
                    evaluatedNodeCountThisMove++;
                    EvalMiss++;
                } 
            } else {
                evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights);
                //let e  = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, member.weights, maximisingPlayer);
                //depth % 2 == 0 ? evaluation = e : evaluation = -e;
                //evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, population, index);
                member.evaluationDB[key] = {eval: evaluation, depth: depth}
                //member.evaluationDB.put(key, {eval: evaluation, depth: depth})
                //population.set(index, member);
                //population.get(index).evaluationDB[key] = {eval: evaluation, depth: depth}
                //console.log('eval miss')
                evaluatedNodeCountThisMove++;
                EvalMiss++;
            }/**/

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


export function getBestMoveTrainedBot(checkers: CheckersGame, depth: number, bot: TrainedBot): { move: Move, evaluatedNodeCount: number } {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove: Move;

    //let scores: any[][] = []; //

    //if (moves == undefined) {
    //    moves = checkers.getMoves();
    //}

    evaluatedNodeCountThisMove = 0;

    //let maximisingPlayer = checkers.player
    //let odd = depth % 2 == 1;
    //AB, QS, the player who, at that stage should a mate be found, needs to be the one with no pieces to return positive evaluation
    //if (depth % 2 == 0) {
        // AB - player == startplayer -> neg else pos
        // AB - POS!
        // QS - -> neg (PoS!)
        //let AB = checkers.player == Player.WHITE ? Player.BLACK : Player.WHITE
        //let QS = checkers.player == Player.WHITE ? 
        /*if (checkers.player == Player.WHITE) {
            let AB = Player.BLACK
            let QS = Player.
        } else {
            let AB = Player.WHITE
            
        }*/
    //} else {
        // AB - -> neg
        // QS - -> neg (POS!)
        /*if (checkers.player == Player.WHITE) {
            let AB = Player.
            let QS = Player.
        } else {
            let AB = Player.
            let QS = Player.
        }*/
    //}

    const moves = checkers.getMoves();

    if (moves.length == 1) {
        return { move: moves[0], evaluatedNodeCount: 1 };
    }
  
    for (const move of moves) {

        const next = checkers.makeMove(move);
        let evaluation: number;

        //evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot.weights);
        EvalMiss++;
        
        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        //if (key in bot.evaluationDB) {
        if (bot.evaluationDB.has(key)) {
            //if (bot.evaluationDB[key].depth >= depth) {
            if (bot.evaluationDB.get(key)!.depth >= depth) {
                //evaluation = bot.evaluationDB[key].eval
                evaluation = bot.evaluationDB.get(key)!.eval
                evaluatedNodeCountThisMove++;
                EvalHit++;
            } else {
                evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot.weights);
                //let e  = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot.weights);
                //depth % 2 == 0 ? evaluation = e : evaluation = -e;
                //evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, population, index);
                bot.evaluationDB.put(key, {eval: evaluation, depth: depth})
                EvalMiss++;
            } 
        } else {
            evaluation = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot.weights);
            //let e  = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, bot.weights);
            //depth % 2 == 0 ? evaluation = e : evaluation = -e;
            bot.evaluationDB.put(key, {eval: evaluation, depth: depth})
            //bot.evaluationDB[key] = {eval: evaluation, depth: depth}
            EvalMiss++;
        }/**/
       


        //scores.push([printBoard(next.board.white, next.board.black, next.board.king, false), next.board.getBoardStats(), evaluation]);
        
        if (evaluation >= bestScore) {
            bestScore = evaluation;
            bestMove = move;
        }
    }
    //console.log(depth, 'best move', bestMove!, bestScore)
    console.log('evaluated nodes', evaluatedNodeCountThisMove)
    //console.log('scores', scores)
    return { move: bestMove!, evaluatedNodeCount: evaluatedNodeCountThisMove };
}

/*export function naiveMinimax(checkers: CheckersGame, depth: number) {    

    const moves = checkers.getMoves();
  
    for (const move of moves) { 
        const next = checkers.makeMove(move);
        naiveMinimax(next, depth - 1);
    }
    return
}*/

export function naiveMinimax(checkers: CheckersGame, depth: number): Move {    
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove!: Move;

    const moves = checkers.getMoves();

    if (moves.length == 1) return moves[0];
  
    for (const move of moves) { 
        const next = checkers.makeMove(move);
        let evaluation: number = alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, {}, true);
        if (evaluation >= bestScore) {
            bestScore = evaluation;
            bestMove = move;
        }
    }
    return bestMove;
}/**/


//function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, population: Map<number, WeightSet>, index: number) {
function alphaBetaSearch(checkers: CheckersGame, depth: number, alpha: number, beta: number, weights: BoardStats, naive: boolean = false) {

    //const member = population.get(index);

    //if (evaluatedNodeCountThisMove > 500000) {
    //    console.log('AB evaluated nodes surpassed', evaluatedNodeCountThisMove)
    //    return quiescenceSearch(checkers, alpha, beta, weights);
    //}

    if (depth === 0) return quiescenceSearch(checkers, alpha, beta, weights, naive);
    //if (depth === 0) return quiescenceSearch(checkers, alpha, beta, whiteWeights, blackWeights, evaluatingPlayer);
    //if (depth === 0) return quiescenceSearch(checkers, alpha, beta, whiteWeights, blackWeights);

    const moves = checkers.getMoves();
    //console.log(depth, moves.length)

    if (moves.length == 0) {
        //return checkers.player === Player.WHITE ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        evaluatedNodeCountThisMove++;
        //return checkers.player === Player.WHITE ? MAX_EVAL+depth : -(MAX_EVAL+depth);
        //return maximisingPlayer == checkers.player ? -(MAX_EVAL+depth) : MAX_EVAL+depth;
        //return -(MAX_EVAL+depth);
        return MAX_EVAL+depth; //odd || checkers.player == maximisingPlayer ? -(MAX_EVAL+depth) : MAX_EVAL+depth;
    }
  
    for (const move of moves) {
    //for (const move of moves) {
        const next = checkers.makeMove(move);
        const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, weights, naive);
        /*let evaluation: number;
        let key = generateKeyComplete(next.board.white, next.board.black, next.board.king)
        if (key in population.get(index).evaluationDB) {
            if (member.evaluationDB[key].depth >= depth) {
                evaluation =  population.get(index).evaluationDB[key].eval
                EvalHit++;
            } else {
                evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, population, index);
                member.evaluationDB[key] = {eval: evaluation, depth: depth}
                EvalMiss++;
            } 
        } else {
            evaluation = -alphaBetaSearch(next, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, population, index);
            member.evaluationDB[key] = {eval: evaluation, depth: depth}
            //population.set(index, member);
            //population.get(index).evaluationDB[key] = {eval: evaluation, depth: depth}
            //console.log('eval miss')
            EvalMiss++;
        }*/
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, whiteWeights, blackWeights, evaluatingPlayer == Player.WHITE ? Player.BLACK : Player.WHITE);
        //const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha, whiteWeights, blackWeights);
        if (evaluation >= beta) return beta;
        alpha = Math.max(evaluation, alpha);
    }
  
    return alpha;
}


function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, weights: BoardStats, naive?: boolean) {
//function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, weights: BoardStats, maximisingPlayer: Player) {
//function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, whiteWeights: BoardStats, blackWeights: BoardStats, evaluatingPlayer: Player) {
//function quiescenceSearch(checkers: CheckersGame, alpha: number, beta: number, whiteWeights: BoardStats, blackWeights: BoardStats) {

    //if (evaluatedNodeCountThisMove > 500000) {
    //    console.log('QS evaluated nodes surpassed', evaluatedNodeCountThisMove)
    //    //return quiescenceSearch(checkers, alpha, beta, weights);
    //    return 0;
    //}
    
    

    const moves = checkers.getMoves();
    
    if (moves.length == 0) {
        //return checkers.player === Player.WHITE ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        //return checkers.player === Player.WHITE ? MAX_EVAL / 2 : -MAX_EVAL / 2;
        //return Number.POSITIVE_INFINITY
        //return -(MAX_EVAL / 2)
        evaluatedNodeCountThisMove++;
        //return maximisingPlayer == checkers.player ? -(MAX_EVAL / 2) : MAX_EVAL / 2;
        return (MAX_EVAL / 2)
    }

    //let d = checkDraw(checkers.board.white, checkers.board.black, checkers.board.king);



    //const evaluation = checkers.player == Player.WHITE ? evaluateBoard(checkers, weights): 
    //const evaluation = evaluateBoard(checkers, weights)
    const evaluation = naive ? evaluateBoardNaive(checkers) : evaluateBoard(checkers, weights);

    
    //console.log('evaluating player', evaluatingPlayer)
    //console.log('checkers player', checkers.player)
    //const evaluation = evaluateBoard(checkers, checkers.player == Player.WHITE ? whiteWeights : blackWeights);
    //printBoard(checkers.board.white, checkers.board.black, checkers.board.king)
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);

    evaluatedNodeCountThisMove++;
    //if (evaluatedNodeCountThisMove > 500000) {
    //    console.log('QS evaluated nodes surpassed', evaluatedNodeCountThisMove)
    //    //return quiescenceSearch(checkers, alpha, beta, weights);
    //    return alpha;
    //}/**/
  
    for (const move of checkers.getMoves()) {
    //for (const move of moves) {
        if (!move.captures) continue;
    
        const next = checkers.makeMove(move);
        
        const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, weights, naive);
        //const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, whiteWeights, blackWeights, evaluatingPlayer == Player.WHITE ? Player.BLACK : Player.WHITE);
        //const nextEvaluation = -quiescenceSearch(next, -beta, -alpha, whiteWeights, blackWeights);
    
        if (nextEvaluation >= beta) return beta;
        alpha = Math.max(nextEvaluation, alpha);
    }

    //console.log('alpha', alpha, evaluation)

    
  
    return alpha;
}


const PIECE_COUNT_CONSTANT = 24;
const BOARD_STAT_COUNT = 11;

export function evaluateBoard(checkers: CheckersGame, weights: BoardStats): number {
    const pieceCount: number = getPieceCount(checkers.board.white | checkers.board.black);
    const stats: BoardStats = checkers.board.getBoardStats();
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

    return checkers.player == Player.BLACK ? score : -score;
}

export function evaluateBoardNaive(checkers: CheckersGame, getStats: boolean = true): number {

    //if (getStats) checkers.board.getBoardStats(true);
    if (getStats) {
        const p = checkers.player === Player.WHITE ? checkers.board.black : checkers.board.white;
        checkers.board.persistStatsForValue(p, checkers.player)
        return 0;
    } else {
        let score = getPieceCount(checkers.board.white) - getPieceCount(checkers.board.black);
        return checkers.player == Player.BLACK ? score : -score;
    }

}

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





