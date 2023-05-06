import { Board } from "./board";
import { Player, Move, BoardStats } from "./types";
import { getPresentBits, getBoardFromBin, getBestBoardDefault } from "./helper";

export class CheckersGame {
    public board: Board;
    public player: Player;
    readonly bestBoard: BoardStats;

    private moveList: Move[] | undefined = undefined;    

    constructor(
        board: Board = new Board(),
        turn: Player = Player.WHITE,
        bestBoard: BoardStats = getBestBoardDefault(),
    ) {
        this.board = board;
        this.player = turn;
        this.bestBoard = bestBoard;
    }

    // return a copy of the checkers object
    _copy(): CheckersGame {
        return new CheckersGame(this.board)
    }

    // get available moves for the current player
    getMoves(): Move[] {
        if (!this.moveList) {
            const capturePieces = this.getPiecesWithCaptures();
            this.moveList = capturePieces ? this.getCaptureList(capturePieces) : this.getMoveList(this.getPiecesWithMoves());
        }
        return this.moveList;
    }

    // make a move and return a new checkers object
    makeMove(move: Move): CheckersGame {
        if (!this.getMoves().includes(move)) {
            console.log('no match byRef')
            const isValid = this.getMoves().some(m => m.start === move.start && m.end === move.end && m.captures === move.captures)
            if (!isValid) {
                console.log('player', this.player)
                console.log('move', move)
                console.log('moves', this.getMoves())
                console.log(this.getMoves().includes(move))
                for (const m of this.getMoves()) {
                    console.log(m, move, m === move, m == move, typeof m, typeof move, m.start === move.start && m.end === move.end && m.captures === move.captures)
                }
                throw new Error('invalid move');
            }
        }
        if (move.captures) getBoardFromBin(move.captures)
        const nextBitboard = this.player === Player.WHITE ? this.board.makeMoveWhite(move) : this.board.makeMoveBlack(move);
        const nextPlayerToMove = this.player === Player.WHITE ? Player.BLACK : Player.WHITE;

        return new CheckersGame(nextBitboard, nextPlayerToMove)
    }

    // get the list of available moves for the current player
    private getMoveList(moveablePieces: number): Move[] {
        return getPresentBits(moveablePieces).flatMap(moveablePieces => this.getMovesFromCoord(moveablePieces));
    }
    
    // get the list of available captures for the current player
    private getCaptureList(capturePieces: number): Move[] {
        return getPresentBits(capturePieces).flatMap(capturePieces => this.getCapturesfromCoord(capturePieces));
    }
    
    // get the list of movable pieces for the current player
    private getPiecesWithMoves(): number {
        return this.player === Player.WHITE
            ? this.board.getMovablePiecesWhite()
            : this.board.getMovablePiecesBlack();
    }

    // get the list of pieces with captures for the current player
    private getPiecesWithCaptures(): number {
        return this.player === Player.WHITE
            ? this.board.getCapturePiecesWhite()
            : this.board.getCapturePiecesBlack();
    }

    // get the list of moves for a given coordinate
    private getMovesFromCoord(start: number): Move[] {
        return this.player === Player.WHITE ? this.board.getMovesWhite(start) : this.board.getMovesBlack(start);
    }

    // get the list of captures for a given coordinate
    private getCapturesfromCoord(start: number): Move[] {
        
        const searchNodes: Move[] = this.player === Player.WHITE ? this.board.getCapturesWhite(start): this.board.getCapturesBlack(start);
        const capturesFound: Move[] = [];
        
        while (searchNodes.length > 0) {
            const capture = searchNodes.pop();
            if (!capture) break;

            const nextCaptures =
                (this.player === Player.WHITE
                    ? this.board.getCapturesWhite(capture.end, capture.captures, capture.start & this.board.king)
                    : this.board.getCapturesBlack(capture.end, capture.captures, capture.start & this.board.king))

            if (nextCaptures.length > 0) {
                searchNodes.push(
                ...nextCaptures.map(nextCapture => ({
                    start: capture.start,
                    end: nextCapture.end,
                    captures: nextCapture.captures | capture.captures,
                }))
                );
            } else {
                capturesFound.push(capture);
            }
        }
        return capturesFound;
    }
}