import { getBestMoveTrainedBot } from "./ai";
import { Board } from "./board";
import { CheckersGame } from "./checkers";
import { BloomDatabase } from "./database";
import { checkDraw, generateBin, getKeyByValue, getPresentBitIndexes, getWeights, printBoard } from "./helper";
import { Move, Player, Status, TrainedBot, WeightInit } from "./types";


type PlayMove = {
	add: number[];
	addColour: string;
	remove: number[];
	king: number[];
}

// class to handle the checker playing processes
export class PlayGame {

	public checkers: CheckersGame;
	public playAs: Player;
	public depth: number;
	public status: number;
	private moveLimit: number;
	private moveIndex: number;
	private bot: TrainedBot;
	public evaluatedNodeCount: number;
	private boardStack: number[][];
	public nonManMoves: number;
	public BIN: Record<number, number>
	private boardStatsDatabase: BloomDatabase;
	private databaseGenerated: boolean;
	private boardInit: Board;

	constructor(playAs: Player = Player.WHITE, depth: number = 10, board: Board | undefined = undefined, turn: Player = Player.WHITE) {
		this.playAs = playAs;
		this.depth = depth;
		this.status = 0;
		this.moveLimit = 200;
		this.moveIndex = 0;
		this.bot = this.getBot();
		this.evaluatedNodeCount = 0;
		this.boardStack = [];
		this.nonManMoves = 0;
		this.BIN = generateBin();
		this.boardStatsDatabase = new BloomDatabase();
		this.databaseGenerated = false;
		this.boardInit = board ? board : new Board();
		this.checkers = new CheckersGame(this.boardInit, turn);
	}

	startGame(playAs: Player, depth: number = 10): void {
		this.checkers = new CheckersGame(this.boardInit);
		this.status = 0;
		this.moveIndex = 0;
		this.evaluatedNodeCount = 0;
		this.boardStack = [];
		this.nonManMoves = 0;
		this.playAs = playAs;
		this.depth = depth;
		if (!this.databaseGenerated) {
			this.boardStatsDatabase.generate(7, 8, 4)
			this.databaseGenerated = true;
		}
	}


	getBot(): TrainedBot {
		return {
			"weights": getWeights(WeightInit.TRAINED),
			"evaluationDB": {}
		}
	}

	userMove(move: Move): Status {
		if (this.playAs !== this.checkers!.player) return Status.PLAYING
		this.checkers = this.checkers!.makeMove(move);
		printBoard(this.checkers.board.white, this.checkers.board.black, this.checkers.board.king);
		this.moveIndex++;
		(move.end & this.checkers.board.king) && !move.captures ? this.nonManMoves++ : this.nonManMoves = 0;
        this.boardStack.push([this.checkers.board.white, this.checkers.board.black, this.checkers.board.king]);
        if (this.boardStack.length > 5) this.boardStack.shift();
		this.checkGameOver()
		return this.status
	}

	aiMove(move: Move): Status {
		this.checkers = this.checkers!.makeMove(move);
		printBoard(this.checkers.board.white, this.checkers.board.black, this.checkers.board.king);
		this.moveIndex++;
		(move.end & this.checkers.board.king) && !move.captures ? this.nonManMoves++ : this.nonManMoves = 0;
        this.boardStack.push([this.checkers.board.white, this.checkers.board.black, this.checkers.board.king]);
        if (this.boardStack.length > 5) this.boardStack.shift();
		this.checkGameOver()
		return this.status
	}

	checkGameOver(): void {
		console.log('checkGameOver')
		if (this.checkers!.getMoves().length == 0) {
			this.status = this.checkers!.player == Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON;
			console.log("Game over1", Status[this.status]);
		} else if (this.moveIndex >= this.moveLimit) {
			this.status = Status.DRAW_MOVELIMIT;
			console.log("Game over2", Status[this.status]);
		} else {
			this.status = checkDraw(this.boardStack, this.nonManMoves);
			if (this.status != Status.PLAYING) {
				console.log("Game over3", Status[this.status]);
			}
		}
	}
			

	moveToPlayMove(move: Move): PlayMove {
		const end = getPresentBitIndexes(move.end);
		const addColour = (this.checkers!.board.white & move.end) !== 0 ? "w" : "b";
		const remove = [...getPresentBitIndexes(move.start), ...getPresentBitIndexes(move.captures)]
		const king = getPresentBitIndexes(this.checkers!.board.king)
		let playMove: PlayMove = {
			add: end,
			addColour: addColour,
			remove: remove,
			king: king
		};
		return playMove;
	}

	getMove(start: number, end: number): Move {

		let startBin = this.BIN[start];
		let endBin = this.BIN[end];
		const moves = this.checkers!.getMoves();
		for (let i=0; i<moves.length; i++) {
			if (Math.abs(moves[i].start) == +startBin && Math.abs(moves[i].end) == +endBin) {
				return moves[i];
			}
		}
		throw new Error("Invalid move");
	}

	getAiMove(): { move: Move, evaluatedNodeCount: number, evaluation: number } {
		let m = getBestMoveTrainedBot(this.checkers!, this.depth, this.bot, this.boardStatsDatabase);
		this.evaluatedNodeCount += m.evaluatedNodeCount;
		return m;
	}

	getEndSquares(start: number): number[] {
		let startBin = this.BIN[start];
		const moves = this.checkers!.getMoves();
		let endSquares: number[] = [];
		for (let i=0; i<moves.length; i++) {
			if (Math.abs(moves[i].start) == +startBin) {
				let index = getKeyByValue(moves[i].end, this.BIN)
				if (index) endSquares.push(index);
			}
		}
		return endSquares;
	}


	validateMove(start: number, end: number): boolean {
		console.log(start, end)
		let startBin = this.BIN[start];
		let endBin = this.BIN[end];
		console.log(startBin, endBin)
		const moves = this.checkers!.getMoves();
		for (let i=0; i<moves.length; i++) {
			console.log(Math.abs(moves[i].start), Math.abs(moves[i].end))
			if (Math.abs(moves[i].start) == +startBin && Math.abs(moves[i].end) == +endBin) return true;
		}
		return false
	}
}
