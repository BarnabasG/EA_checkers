import { getBestMoveTrainedBot } from "./ai";
//import { BloomHashMapEvalData } from "./bloomDatabase";
import { CheckersGame } from "./checkers";
import { checkDraw, decToBin, generateBin, getPresentBitIndexes, printBoard } from "./helper";
import { Move, Player, Status, TrainedBot, BloomHashMapEvalData } from "./types";



//var checkers = new CheckersGame();

//export var moves: Move[] = [];

type PlayMove = {
	add: number[];
	addColour: string;
	remove: number[];
	king: number[];
}

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

	constructor(playAs: Player = Player.WHITE, depth: number = 10) {
		this.checkers = new CheckersGame();
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
	}

	startGame(playAs: Player, depth: number = 10): void {
		this.checkers = new CheckersGame();
		this.status = 0;
		this.moveIndex = 0;
		this.evaluatedNodeCount = 0;
		this.boardStack = [];
		this.nonManMoves = 0;
		this.playAs = playAs;
		this.depth = depth;

		//this.bot = this.getBot();
	}


	getBot(): TrainedBot {
		return {
			"weights": {"pieces":1,"kings":0.2,"avrDist":0.2,"backline":0.2,"corners":0.2,"edges":0.2,"centre2":0.2,"centre4":0.2,"centre8":0.8,"defended":0.2,"attacks":0.2},
			'evaluationDB': new BloomHashMapEvalData()
        	//"evaluationDB": {}
		}
	}

	/*userMove(): PlayMove {
		let move: Move = this.checkers.getMoves()[0];
		this.checkers = this.checkers.makeMove(move);
		this.moveIndex++;
		return this.moveToPlayMove(move);
	}*/

	userMove(move: Move): Status {
		if (this.playAs !== this.checkers.player) return Status.PLAYING
		this.checkers = this.checkers.makeMove(move);
		printBoard(this.checkers.board.white, this.checkers.board.black, this.checkers.board.king);
		this.moveIndex++;
		move.end && this.checkers.board.king ? this.nonManMoves++ : this.nonManMoves = 0;
        this.boardStack.push([this.checkers.board.white, this.checkers.board.black, this.checkers.board.king]);
        if (this.boardStack.length > 5) this.boardStack.shift();
		this.checkGameOver()
		return this.status
	}

	aiMove(move: Move): Status {
		//let m = getBestMoveTrainedBot(this.checkers, this.depth, this.bot);
		//let move: Move = m.move;
		//this.evaluatedNodeCount += m.evaluatedNodeCount;
		this.checkers = this.checkers.makeMove(move);
		printBoard(this.checkers.board.white, this.checkers.board.black, this.checkers.board.king);
		this.moveIndex++;
		move.end && this.checkers.board.king ? this.nonManMoves++ : this.nonManMoves = 0;
        this.boardStack.push([this.checkers.board.white, this.checkers.board.black, this.checkers.board.king]);
        if (this.boardStack.length > 5) this.boardStack.shift();
		this.checkGameOver()
		return this.status
	}

	checkGameOver(): void {
		if (this.checkers.getMoves().length == 0) {
			this.status = this.checkers.player == Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON;
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
		const addColour = (this.checkers.board.white & move.end) !== 0 ? "w" : "b";
		const remove = [...getPresentBitIndexes(move.start), ...getPresentBitIndexes(move.captures)]
		const king = getPresentBitIndexes(this.checkers.board.king)
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
		const moves = this.checkers.getMoves();
		for (let i=0; i<moves.length; i++) {
			if (Math.abs(moves[i].start) == +startBin && Math.abs(moves[i].end) == +endBin) {
				return moves[i];
			}
		}
		throw new Error("Invalid move");
	}

	getAiMove(): Move {
		let m = getBestMoveTrainedBot(this.checkers, this.depth, this.bot);
		let move: Move = m.move;
		this.evaluatedNodeCount += m.evaluatedNodeCount;
		return move;
	}

	getEndSquares(start: number): number[] {
		let startBin = this.BIN[start];
		const moves = this.checkers.getMoves();
		let endSquares: number[] = [];
		console.log(startBin)
		for (let i=0; i<moves.length; i++) {
			console.log(moves[i].start, moves[i].end)
			if (Math.abs(moves[i].start) == +startBin) {
				//endSquares.push(+this.BIN.indexOf(moves[i].end.toString()));
				endSquares.push(this.BIN[moves[i].end]);
			}
		}
		return endSquares;
	}


	validateMove(start: number, end: number): boolean {
		//numbers as bit indexes
		console.log(start, end)
		let startBin = this.BIN[start];
		let endBin = this.BIN[end];
		//let startBin = decToBin(start);
		//let endBin = decToBin(end);
		console.log(startBin, endBin)
		const moves = this.checkers.getMoves();
		for (let i=0; i<moves.length; i++) {
			console.log(Math.abs(moves[i].start), Math.abs(moves[i].end))
			if (Math.abs(moves[i].start) == +startBin && Math.abs(moves[i].end) == +endBin) return true;
		}
		return false
	}






}


//function getCaptureIndexes(captures: number): number[] {
//	return getPresentBitIndexes(captures);
//}





/*export async function play(playAs: Player, depth: number = 7): Promise<number> {
    checkers = new CheckersGame();
    let status = 0;
    let moveIndex = 0;
    //const depth = 10;
    const moveLimit = 200;
    //const botColour = playAs === Player.WHITE ? Player.BLACK : Player.WHITE;


    /*let bot: TrainedBot = {
        "weights": getCapturePrefer(),
        "evaluationDB": {}
    }*

    let evaluatedNodeCount = 0;
    //let evaluatedNodeCountThisMove = 0;

    let bot: TrainedBot = {
        "weights": {"pieces":1,"kings":0.2,"avrDist":0.2,"backline":0.2,"corners":0.2,"edges":0.2,"centre2":0.2,"centre4":0.2,"centre8":0.8,"defended":0.2,"attacks":0.2},
        "evaluationDB": {}
    }

    //let bot2: TrainedBot = {
    //    "weights": {"pieces":0.2,"kings":0.2,"avrDist":0.2,"backline":0.2,"corners":0.2,"edges":0.2,"centre2":0.2,"centre4":0.2,"centre8":0.2,"defended":0.2,"attacks":0.2},
    //    "evaluationDB": {}
    //}

    let boardStack: number[][] = [];
    let nonManMoves: number = 0;



    while (moveIndex < moveLimit) {

        // include search tree for bot, continue to update when waiting for user move
        // cut off unviable paths when user moves

        

        //let player: Player = moveIndex % 2;

        let moves = checkers.getMoves();
        //console.log(moves)
        status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
        //console.log(status, status !== 0)
        if (status !== 0) {
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
            //console.log('Game Over', moveIndex, status, Status[status]);
            //console.log(status == 1 ? 'white won' : 'black won');
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
            console.log(checkers.player)
            return Promise.resolve(status);
        }

        console.log(`Move ${moveIndex+1}`)
        console.log(`${checkers.player == Player.WHITE ? "White" : "Black"} to move (${checkers.player == playAs ? "You" : "Bot"})`)
        printBoard(checkers.board.white, checkers.board.black, checkers.board.king)

        
        
        let move: Move;
        if (checkers.player !== playAs) {
            let m = getBestMoveTrainedBot(checkers, depth, bot);
            move = m.move;
            evaluatedNodeCount += m.evaluatedNodeCount;
            //console.log(`(${evaluatedNodeCount} nodes evaluated)`)
            checkers = checkers.makeMove(move);
        } else {
            move = await getUserMove(checkers);
            //let m = getBestMoveTrainedBot(checkers, depth, bot, moves);
            //move = m.move;
            checkers = checkers.makeMove(move);
        }


        move.end && checkers.board.king ? nonManMoves++ : nonManMoves = 0;
        boardStack.push([checkers.board.white, checkers.board.black, checkers.board.king]);
        if (boardStack.length > 5) boardStack.shift();
        //console.log("here")
        //if (checkDraw(boardStack, nonManMoves)) break;
        let s = checkDraw(boardStack, nonManMoves)
        if (s < 0) return Promise.resolve(s);
        //console.log("not here")


        moveIndex++;
    }

    console.log('node count', evaluatedNodeCount)

    return Promise.resolve(Status.DRAW_MOVELIMIT);

}*/

//export function getMoves(): Move[] {
//    return checkers.getMoves();
//}

/*export function validateMove(start: number, end: number): boolean {
	//numbers as bit indexes
	let startBin = decToBin(start);
	let endBin = decToBin(end);
	const moves = checkers.getMoves();
	for (let i=0; i<moves.length; i++) {
		if (moves[i].start == +startBin && moves[i].end == +endBin) return true;
	}
	return false
}

function getUserMove(checkers: CheckersGame): Promise<Move> {
	// Prompt the user for input and return a Promise that resolves with the user's move

	//const moves = checkers.getMoves();

	return new Promise(resolve => {
		// Replace this with your own code to prompt the user for input
		//const move: Move = moves[0];
		//resolve(move);
	});
}*/



//play(Player.BLACK, 8).then((status) => {
//    console.log('Game Over', status, Status[status]);
    //console.log(status > 0 ? status == -1 ? 'Draw by Repetition' : 'Draw by 40 Move Rule' : status == 1 ? 'White Won' : 'Black Won');
    //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
//})

// Example code to prompt the user for input and display the game board
/*async function runGame() {
    const board: Board = /* Initialize the game board *;
    let userMove: Move | null = null;
  
    while (!isGameOver(board)) {
      console.log(renderBoard(board));
  
      // Prompt the user for input
      userMove = await getUserMove();
  
      // Calculate the program's move asynchronously
      const programMove: Move = await calculateProgramMove(board);
  
      // Update the game board with the moves
      board = applyMove(board, userMove);
      board = applyMove(board, programMove);
    }
  
    console.log(renderBoard(board));
    console.log(getWinner(board));
  }
  
  // Helper functions for the game logic
  function isGameOver(board: Board): boolean {
    // Check if the game is over
    return false;
  }
  
  function renderBoard(board: Board): string {
    // Render the game board as a string
    return '';
  }
  
  function getUserMove(): Promise<Move> {
    // Prompt the user for input and return a Promise that resolves with the user's move
    return new Promise(resolve => {
      // Replace this with your own code to prompt the user for input
      const move: Move = { from: [0, 1], to: [1, 2] };
      resolve(move);
    });
  }
  
  function applyMove(board: Board, move: Move | null): Board {
    // Apply the move to the game board and return the updated board
    return board;
  }
  
  function getWinner(board: Board): string {
    // Determine the winner of the game and return a message
    return '';
  }
  
  // Run the game
  runGame();*/