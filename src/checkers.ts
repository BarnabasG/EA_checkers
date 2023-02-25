import { Board } from "./board";
//import { Population } from "./population";
import { Player, Move, Status, BoardStats, PopulationSet, BoardDatabase } from "./types";
import { getPresentBits, getBoardFomBin, printBoard, reduceCaptures, getInitBoardStats } from "./helper";



export class CheckersGame {
    readonly board: Board;
    readonly player: Player;
    readonly bestBoard: BoardStats;
    //readonly population: Population;
    //readonly status: number;

    //private evaluatedNodeCount: number;

    private moveList: Move[] | undefined = undefined;

    //readonly boardStatsDatabase: BoardDatabase;
    

    constructor(
        //boardStatsDatabase: BoardDatabase,
        board: Board = new Board(),
        turn: Player = Player.WHITE,
        bestBoard: BoardStats = getInitBoardStats(),
        //population: Population = new Population(10),
        //status: number = 0,
        //evaluatedNodeCount: number = 0
    ) {
        this.board = board;
        this.player = turn;
        this.bestBoard = bestBoard;
        //this.boardStatsDatabase = boardStatsDatabase;
        //this.population = population;
        //this.status = status;
        ///this.evaluatedNodeCount = 0;
    }

    getMoves(): Move[] {
        if (!this.moveList) {
            const capturePieces = this.getPiecesWithCaptures();
            this.moveList = capturePieces ? this.getCaptureList(capturePieces) : this.getMoveList(this.getPiecesWithMoves());
        }
        return this.moveList;
    }

    makeMove(move: Move): CheckersGame {
        if (!this.getMoves().includes(move)) throw new Error('invalid move');
        if (move.captures) getBoardFomBin(move.captures)
        const nextBitboard = this.player === Player.WHITE ? this.board.makeMoveWhite(move) : this.board.makeMoveBlack(move);
        const nextPlayerToMove = this.player === Player.WHITE ? Player.BLACK : Player.WHITE;
        const nextBestBoard = this.updateBoardStats();
    
        return new CheckersGame(nextBitboard, nextPlayerToMove, nextBestBoard);
    }

    private updateBoardStats(): BoardStats {
        //console.log('updateBoardStats')
        let newBestBoard = this.board.getBoardStats();
        //console.log('best', this.bestBoard)
        //console.log('current', newBestBoard)
        for (const key in newBestBoard) newBestBoard[key] = Math.max(Math.abs(newBestBoard[key]), this.bestBoard[key]);
        //console.log('after', newBestBoard)
        return newBestBoard;
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
        
        const searchNodes: Move[] = this.player === Player.WHITE ? this.board.getCapturesWhite(start): this.board.getCapturesBlack(start);
        const capturesFound: Move[] = [];
        
        while (searchNodes.length > 0) {
            const capture = searchNodes.pop();
            if (!capture) break;

            const nextCaptures =
                (this.player === Player.WHITE
                    ? this.board.getCapturesWhite(capture.end, capture.captures, capture.start & this.board.king)
                    : this.board.getCapturesBlack(capture.end, capture.captures, capture.start & this.board.king))
                    //.filter(nextCapture => !(nextCapture.captures & capture.captures));
                    //? this.board.getCapturesWhite(capture.end, reduceCaptures(capturesFound.concat(capture)), capture.start & this.board.king)
                    //: this.board.getCapturesBlack(capture.end, reduceCaptures(capturesFound.concat(capture)), capture.start & this.board.king);
            
            
            //filter out captures of pieces that have already been captured
            //nextCaptures.filter(nextCapture => !(nextCapture.captures & capture.captures))
                         

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


    /*getStatus(): Status {
        if (this.getMoves().length === 0) {
            console.log(this.getMoves());
            return this.player === Player.WHITE
                ? Status.BLACK_WON
                : Status.WHITE_WON;
        }
        return Status.PLAYING;
    }*/

}