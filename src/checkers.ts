import { Board } from "./board";
import { Player, Move } from "./types";
import { getPresentBits, printBoardNum } from "./helper";



export class Checkers {
    readonly board: Board;
    readonly player: Player;

    //private evaluatedNodeCount: number;

    private moveList: Move[] | undefined = undefined;

    constructor(
        board: Board = new Board(),
        turn: Player = Player.WHITE,
        //evaluatedNodeCount: number = 0
    ) {
        this.board = board;
        this.player = turn;
        ///this.evaluatedNodeCount = 0;
    }

    getMoves(): Move[] {
        console.log('movelist1', this.moveList);
        if (!this.moveList) {
          const capturePieces = this.getPiecesWithCaptures();
          console.log('capturePieces', printBoardNum(capturePieces));
          this.moveList = capturePieces ? this.getCaptureList(capturePieces) : this.getMoveList(this.getPiecesWithMoves());
        }
        console.log('movelist2', this.moveList);
        return this.moveList;
    }


    makeMove(move: Move): Checkers {
        if (!this.getMoves().includes(move)) {
            console.log('move', move);
            console.log('moves', this.getMoves());
            throw new Error('invalid move');
        }
    
        const nextBitboard = this.player === Player.WHITE ? this.board.makeMoveWhite(move) : this.board.makeMoveBlack(move);
        const nextPlayerToMove = this.player === Player.WHITE ? Player.BLACK : Player.WHITE;
    
        return new Checkers(nextBitboard, nextPlayerToMove);
    }

    private getMoveList(moveablePieces: number): Move[] {
        return getPresentBits(moveablePieces).flatMap(moveablePieces => this.getMovesFromCoord(moveablePieces));
    }
      
    private getCaptureList(capturePieces: number): Move[] {
        return getPresentBits(capturePieces).flatMap(capturePieces => this.getCapturesfromCoord(capturePieces));
    }
    
    
    private getPiecesWithMoves(): number {
        return this.player === Player.WHITE
            ? this.board.getMovablePiecesWhite()
            : this.board.getMovablePiecesBlack();
    }

    private getPiecesWithCaptures(): number {
        return this.player === Player.WHITE
            ? this.board.getCapturePiecesWhite()
            : this.board.getCapturePiecesBlack();
    }


    private getMovesFromCoord(start: number): Move[] {
        return this.player === Player.WHITE ? this.board.getMovesWhite(start) : this.board.getMovesBlack(start);
    }

    private getCapturesfromCoord(start: number): Move[] {

        console.log('start', printBoardNum(start))
        console.log('player', this.player)
        console.log(Player.WHITE)
        console.log(this.player === Player.WHITE)
        
        const captures: Move[] = this.player === Player.WHITE ? this.board.getCapturesWhite(start): this.board.getCapturesBlack(start);

        console.log('captures', captures);

        //gets stuck here TODO
        while (captures.length > 0) {
            const jumpMove = captures.pop();
            if (!jumpMove) break;

            const nextJumpMoves =
                this.player === Player.WHITE
                    ? this.board.getCapturesWhite(jumpMove.end, jumpMove.start & this.board.king)
                    : this.board.getCapturesBlack(jumpMove.end, jumpMove.start & this.board.king);

            if (nextJumpMoves.length > 0) {
                captures.push(
                ...nextJumpMoves.map(nextJumpMove => ({
                    start: jumpMove.start,
                    end: nextJumpMove.end,
                    captures: nextJumpMove.captures | jumpMove.captures,
                }))
                );
            } else {
                captures.push(jumpMove);
            }
        }
        return captures;
    }

}