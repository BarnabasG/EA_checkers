import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { PlayGame } from './src/play';
import { getPresentBitIndexes, printBoard } from './src/helper';
import { Move, Player, Status } from './src/types';

//import { getFiles } from './src/helper';

dotenv.config();

const app: Express = express();
const port = 3000//process.env.PORT;

var game: PlayGame = new PlayGame()

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
    startNewGame()
    console.log(`[server]: Server running at http://localhost:${port}`);
});

app.get('/data', (req: Request, res: Response) => {
    // Retrieve the data from your database or other data source
    const data = {
        '__dirname': __dirname,
        'imgSrc': path.join(__dirname, '../images'),
        'playAs': game.playAs == Player.WHITE ? 'w' : 'b',
    };

    // Return the data in JSON format
    res.json(data);
});

app.post('/start', (req: Request, res: Response) => {
    
    console.log('/start', req.body)
    const playAs = req.body.start;
    console.log('playAs', playAs)
    startNewGame(playAs)
  
    // Return the data in JSON format
    res.send("game started as " + playAs);
});


function startNewGame(playAs: string = 'w') {
    console.log("starting new game as " + playAs)
    resetBoard()
    game = new PlayGame(playAs == 'w' ? Player.WHITE : Player.BLACK)
    printBoard(game.checkers.board.white, game.checkers.board.black, game.checkers.board.king)
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

app.get('/reset', (req: Request, res: Response) => {

        const data = resetBoard()

        res.json(data);
});



//resetBoard();


//function playMove(remove: number[], add: number[], king: number[], addColour: string = "w") {
/*function playMove(remove: number[], add: number[], king: number[], addColour: string = "w") {
    //const remove = [8]
    //const add = [16]
    //const king: any = []
    //const king: any = getPresentBitIndexes(game.checkers.board.king)
    //const addColour = "w"
    let centre = ''
    if (remove.length > 1) centre = remove.slice(1).join('-') + '-'
    const moveString = `${remove[0]}-${centre}${add[0]}`
    const data = {
        "add": add,
        "addColour": addColour,
        "remove": remove,
        "king": king,
        "moveString": moveString,
    }
    return data
}

app.post('/play', (req: Request, res: Response) => {

    const { start, end } = req.body;
    console.log(`Received move to play: ${start}-${end}`);

    const move = game.getMove(+start, +end)
    game.userMove(move)

    const playMoveData = game.moveToPlayMove(move)

    const data = playMove(playMoveData.remove, playMoveData.add, playMoveData.king, playMoveData.addColour)

    res.json(data);
});*/

function extractMoveDetails(move: Move, gameover: Status) {
    let captures = ''
    if (move.captures) {
        let c = getPresentBitIndexes(move.captures).reverse().map(bit => bitIndexToWCDFIndex(bit))
        captures = ` (${c.join(',')})`
    }
    const s = bitIndexToWCDFIndex(getPresentBitIndexes(move.start)[0])
    const e = bitIndexToWCDFIndex(getPresentBitIndexes(move.end)[0])
    const moveString = `${s}-${e}${captures}`

    const playMoveData = {
        "white": getPresentBitIndexes(game.checkers.board.white & ~(game.checkers.board.king)),
        "black": getPresentBitIndexes(game.checkers.board.black & ~(game.checkers.board.king)),
        "whiteKing": getPresentBitIndexes(game.checkers.board.white & game.checkers.board.king),
        "blackKing": getPresentBitIndexes(game.checkers.board.black & game.checkers.board.king),
        "moveString": moveString,
        "status": gameover
    }

    //if (gameover) {
    //    playMoveData["moveString"] += `<br/><b>GAME OVER<br/>${Status[gameover]}</b>}`
    //}
    
    return playMoveData
}

app.post('/play', (req: Request, res: Response) => {

    const { start, end } = req.body;
    console.log(`Received move to play: ${start}-${end}`);

    const move = game.getMove(+start, +end)
    let gameover = game.userMove(move)
    
    const playMoveData = extractMoveDetails(move, gameover)

    //playMoveData["moveString"] = String(game.nonManMoves)

    //const data = playMove(playMoveData.remove, playMoveData.add, playMoveData.king, playMoveData.addColour)

    res.json(playMoveData);
});


app.get('/aimove', (req: Request, res: Response) => {


    const aimove = game.getAiMove()
    let aigameover = game.aiMove(aimove)

    const aiMoveData = extractMoveDetails(aimove, aigameover)    

    res.json(aiMoveData);
});



app.post('/select_piece', (req, res) => {
    //const data = req.body
    //console.log('select_piece', data)
    //console.log(data.start)
    const id = req.body.start;
    console.log(`Received piece id: ${id}`);
    if (game.checkers.player !== game.playAs) res.send(false)
    //res.send(`Returning piece id: ${id}`);
    
    //const moves = game.checkers.getMoves();
    //let moveSquares: number[] = []
    //moves.forEach(move => {
    //    if (move.start === +id) moveSquares.push(game.BIN[move.end])
    
    const endSquares = game.getEndSquares(+id)
    console.log('endSquares', endSquares)
    res.send(endSquares);
});

app.post('/check_move', (req, res) => {
    const { start, end } = req.body;
    console.log(`Received move: ${start}-${end}`);
    //res.send(getMoves());
    const valid = game.validateMove(+start, +end)

    res.send(valid);

});


//function bitwiseIndexToDisplayIndex(bitIndex: number): number {
//    return (Math.floor(bitIndex / 4) * 4) + (3 - bitIndex % 4)
//}

function bitIndexToWCDFIndex(bitIndex: number): number {
    return 32 - bitIndex
    //if (Math.floor(index/8) % 2 == 0) {
    //    return index % 2 == 1 ? Math.floor((index)) + 1 : '';
    //} else {
    //    return index % 2 == 0 ? Math.floor((index)) + 1: '';
    //}
}


//console.log('test')


//playMove();




//getFiles('./images');