import { Board } from "./board";
import { Player, Move, Status } from "./types";
import { getPresentBits, getBoardFomBin } from "./helper";



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
        //console.log('movelist1', this.moveList);
        if (!this.moveList) {
          const capturePieces = this.getPiecesWithCaptures();
          //capturePieces ? console.log('capturePieces', getBoardFomBin(capturePieces)) : console.log('no capturePieces');
          this.moveList = capturePieces ? this.getCaptureList(capturePieces) : this.getMoveList(this.getPiecesWithMoves());
        }
        //console.log('movelist2', this.moveList);
        return this.moveList;
    }


    makeMove(move: Move): Checkers {
        if (!this.getMoves().includes(move)) {
            console.log('move', move);
            console.log('moves', this.getMoves());
            throw new Error('invalid move');
        }
    
        //console.log('move', getBoardFomBin(move.start), getBoardFomBin(move.end))
        if (move.captures) getBoardFomBin(move.captures)
        //console.log('before')
        //printBoard(this.board);
        const nextBitboard = this.player === Player.WHITE ? this.board.makeMoveWhite(move) : this.board.makeMoveBlack(move);
        const nextPlayerToMove = this.player === Player.WHITE ? Player.BLACK : Player.WHITE;
        //console.log('after')
        //printBoard(nextBitboard);
    
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

        //console.log('start', getBoardFomBin(start))
        //console.log('player', this.player)
        //console.log(Player.WHITE)
        //console.log(this.player === Player.WHITE)
        
        const searchNodes: Move[] = this.player === Player.WHITE ? this.board.getCapturesWhite(start): this.board.getCapturesBlack(start);
        const capturesFound: Move[] = [];

        //console.log('searchNodes', searchNodes);
        //console.log('captures found', capturesFound);
        
        while (searchNodes.length > 0) {
            //console.log();
            //console.log('searchNodes', searchNodes);
            const capture = searchNodes.pop();
            //console.log('searchNodes', searchNodes);
            //console.log('capture', capture);
            if (!capture) break;
            //console.log('ss', getBoardFomBin(capture.start), getBoardFomBin(capture.end), getBoardFomBin(capture.captures))
            //console.log('captureBoard', getBoardFomBin(capture.captures));

            const nextCaptures =
                this.player === Player.WHITE
                    ? this.board.getCapturesWhite(capture.end, capture.start & this.board.king)
                    : this.board.getCapturesBlack(capture.end, capture.start & this.board.king);
            
            //console.log('nextCaptures', nextCaptures);

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

    getStatus(): Status {
        if (this.getMoves().length === 0) {
            console.log(this.getMoves());
            return this.player === Player.WHITE
                ? Status.BLACK_WON
                : Status.WHITE_WON;
        }
        return Status.PLAYING;
    }

}