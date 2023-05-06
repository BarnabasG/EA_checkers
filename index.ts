import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { PlayGame } from './src/play';
import { binIndexesToBin, getPresentBitIndexes, moveToMoveString, printBoard, roundTo } from './src/helper';
import { Move, Player, Status } from './src/types';
import { Board } from './src/board';


dotenv.config();

const app: Express = express();
const port = 3000;

var game: PlayGame = new PlayGame()

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    console.log('/ called')
    res.sendFile(path.join(__dirname, '../index.html'));
    game.startGame(Player.WHITE)
});

app.listen(port, () => {
    startNewGame()
    console.log(`[server]: Server running at http://localhost:${port}`);
});

app.get('/data', (req: Request, res: Response) => {
    const data = {
        '__dirname': __dirname,
        'imgSrc': path.join(__dirname, '../images'),
        'playAs': game.playAs == Player.WHITE ? 'w' : 'b',
    };

    res.json(data);
});

app.post('/start', (req: Request, res: Response) => {
    
    console.log('/start', req.body)
    const playAs = req.body.start;
    console.log('playAs', playAs)
    startNewGame(playAs)
  
    res.send("game started as " + playAs);
});


function startNewGame(playAs: string = 'w') {
    console.log("starting new game as " + playAs)
    resetBoard()
    game = new PlayGame(playAs == 'w' ? Player.WHITE : Player.BLACK)
    printBoard(game.checkers!.board.white, game.checkers!.board.black, game.checkers!.board.king)
}


function resetBoard() {
    const whiteMen = [0,1,2,3,4,5,6,7,8,9,10,11]
    const blackMen = [20,21,22,23,24,25,26,27,28,29,30,31]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
    }
    return data
}

app.get('/setBoard', (req: Request, res: Response) => {

    const whiteMen: number[] = []
    const blackMen: number[] = [0,1,2,3,4,5,6,7,8,9,10,15]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
    }
    console.log(data)
    res.json(data);
});


app.get('/reset', (req: Request, res: Response) => {

        const data = resetBoard()
        res.json(data);
});

app.get('/puzzle', (req: Request, res: Response) => {

    const data = getPuzzle10818()
    const whiteBin = binIndexesToBin([...data.whiteMen, ...data.whiteKings])
    const blackBin = binIndexesToBin([...data.blackMen, ...data.blackKings])
    const kingBin = binIndexesToBin([...data.whiteKings, ...data.blackKings])
    const b = new Board(whiteBin, blackBin, kingBin)
    game = new PlayGame(data.playAs == 'w' ? Player.WHITE : Player.BLACK, data.depth == undefined ? 10 : data.depth, b, data.turn == 'w' ? Player.WHITE : Player.BLACK)
    printBoard(game.checkers!.board.white, game.checkers!.board.black, game.checkers!.board.king)
    res.json(data);
});



function extractMoveDetails(move: Move, gameover: Status, evaluation: number | string, evaluatedNodes: number | string, evaluatedNodesThisMove: number | string) {


    const moveString = moveToMoveString(move)

    const playMoveData = {
        "white": getPresentBitIndexes(game.checkers!.board.white & ~(game.checkers!.board.king)),
        "black": getPresentBitIndexes(game.checkers!.board.black & ~(game.checkers!.board.king)),
        "whiteKing": getPresentBitIndexes(game.checkers!.board.white & game.checkers!.board.king),
        "blackKing": getPresentBitIndexes(game.checkers!.board.black & game.checkers!.board.king),
        "moveString": moveString,
        "evaluation": String(evaluation),
        "evaluatedNodes": String(evaluatedNodes),
        "evaluatedNodesThisMove": String(evaluatedNodesThisMove),
        "status": gameover
    }
    
    return playMoveData
}

app.post('/play', (req: Request, res: Response) => {

    const { start, end } = req.body;
    console.log(`Received move to play: ${start}-${end}`);

    const move = game.getMove(+start, +end)
    let gameover = game.userMove(move)
    
    const playMoveData = extractMoveDetails(move, gameover, 'nan', 'nan', 'nan')

    res.json(playMoveData);
});


app.get('/aimove', (req: Request, res: Response) => {

    console.log(game.checkers.player)
    const aimove = game.getAiMove()
    console.log('aimove', aimove)
    let aigameover = game.aiMove(aimove.move)
    let evaluation = aimove.evaluation == -999 ? 'nan' : game.playAs == Player.BLACK ? roundTo(aimove.evaluation, 3) : -roundTo(aimove.evaluation, 3)
    console.log(evaluation)

    const aiMoveData = extractMoveDetails(aimove.move, aigameover, evaluation, game.evaluatedNodeCount, aimove.evaluatedNodeCount)    

    res.json(aiMoveData);
});


app.post('/select_piece', (req, res) => {
    const id = req.body.start;
    console.log(`Received piece id: ${id}`);
    if (game.checkers!.player !== game.playAs) res.send(false)
    const endSquares = game.getEndSquares(+id)
    console.log('endSquares', endSquares)
    res.send(endSquares);
});

app.post('/check_move', (req, res) => {
    const { start, end } = req.body;
    console.log(`Received move: ${start}-${end}`);
    const valid = game.validateMove(+start, +end)
    res.send(valid);
});


function getPuzzle755() {
    //expected move: 10-17 (14)
    //rating 566.9
    const whiteMen = [4,7,10]
    const blackMen = [12,17,18]
    const whiteKings: number[] = [22]
    const blackKings: number[] = [6]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 2
    }
    return data
}

function getPuzzle34() {
    //expected move: 6-31 (10,19,27)
    //rating 663.7
    const whiteMen = [4,27]
    const blackMen = [18,21,22]
    const whiteKings: number[] = [26]
    const blackKings: number[] = [5,13]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 9
    }
    return data
}


function getPuzzle789() {
    //expected move: 20-11 (16), 9-18 (14), 22-6 (10,18)
    //rating 846.1
    const whiteMen = [0,1,3,4,7,10,12,13,15,18]
    const blackMen = [9,16,19,20,22,23,27,28,29,30]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 3
    }
    return data
}

function getPuzzle4559() {
    //expected move: 19-15, 22-26, 15-8 (11)
    //rating 910.7
    const whiteMen = [9,11,12,13,14]
    const blackMen = [10,19,20,21,25]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 5
    }
    return data
}

function getPuzzle9852() {
    //expected move: 8-11, 1-5, 11-18 (15)
    //rating 1015.2
    const whiteMen = [4,7,11,12]
    const blackMen = [13,17,23,31]
    const whiteKings: number[] = [24]
    const blackKings: number[] = [2]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 7
    }
    return data
}

function getPuzzle8658() {
    //expected move: 6-2 (plays 6-1)
    //rating 1122.7
    const whiteMen = [1,4,7,11,26]
    const blackMen = [9,12,13,17,27]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 12
    }
    return data
}

function getPuzzle13119() {
    //expected move: 10-14, 26-30, 14-5 (9) 
    //rating 1209.3
    const whiteMen = [0,10,11,14]
    const blackMen = [6,19,21,23]
    const whiteKings: number[] = [22]
    const blackKings: number[] = [1]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 10
    }
    return data
}

function getPuzzle14731() {
    //expected move: 13-9, 23-32 (27), 9-6, 1-10 (6), 7-23 (10,18) 
    //rating 1350.8
    //fails
    const whiteMen = [4,5,11,19]
    const blackMen = [9,12,14,31]
    const whiteKings: number[] = [25]
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 15
    }
    return data
}

function getPuzzle10818() {
    //expected move: 15-19, 23-7 (11,19), 3-26 (7,14,22)
    //rating 1376.0
    const whiteMen = [18,28]
    const blackMen: number[] = []
    const whiteKings: number[] = [9,10]
    const blackKings: number[] = [17,21,29]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "w",
        "turn": "b",
        "depth": 7
    }
    return data
}


function getPuzzle14617() {
    //expected move: 15-19, 23-7 (11,19), 3-26 (7,14,22)
    //rating 1500.0
    const whiteMen = [0,2,8,11,13,26]
    const blackMen = [9,18,20,22,27,31]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 4
    }
    return data
}

function getPuzzle8957() {
    //expected move: 3-7, 11-16, 20-11 (16)
    //rating 1643.9
    const whiteMen = [2,12,14,27]
    const blackMen = [11,13,21,31]
    const whiteKings: number[] = [29]
    const blackKings: number[] = [5]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 12
    }
    return data
}

function getPuzzle12580() {
    //rating 1720.5
    //failed
    const whiteMen = [0,2,4,5,6,9,10,11]
    const blackMen = [13,16,18,22,24,25,26,30]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 20
    }
    return data
}

function getPuzzle7407() {
    //rating 1720.5
    //failed
    const whiteMen = [0,13,14,18]
    const blackMen = [12,19,27]
    const whiteKings: number[] = [29]
    const blackKings: number[] = [9]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 15
    }
    return data
}

function getPuzzle5384() {
    //expected move: 27-24
    //rating 1775.3
    const whiteMen = [0,5,6,9]
    const blackMen = [4,16,17,30]
    const whiteKings: number[] = [23]
    const blackKings: number[] = [7]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 10
    }
    return data
}

function getPuzzle6613() {
    //expected move: 14-18
    //rating 1801.5
    const whiteMen = [11,12]
    const blackMen = [15,20,21,28]
    const whiteKings: number[] = [18,22]
    const blackKings: number[] = [16]
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 9
    }
    return data
}

function getPuzzle6398() {
    //rating 1877.1
    //failed
    const whiteMen = [2,3,5,6,13,27]
    const blackMen = [11,12,21,25,30,31]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 15
    }
    return data
}

function getPuzzle1412() {
    //rating 1963.9
    //failed
    const whiteMen = [1,4,5,7,9,10,13,14,15,17]
    const blackMen = [12,19,20,21,22,23,24,26,28,30]
    const whiteKings: number[] = []
    const blackKings: number[] = []
    const data = {
        "whiteMen": whiteMen,
        "blackMen": blackMen,
        "whiteKings": whiteKings,
        "blackKings": blackKings,
        "playAs": "b",
        "turn": "w",
        "depth": 15
    }
    return data
}
