//import { Checkers } from './checkers';
//import { printBoard, getRandom, getBoardFomBin, getBoardString, randomGame } from './helper';
//import { Player, Status } from './types';


//import { minimaxGame, randomGame, saveBoardStatsDatabase } from './helper';
//import { saveBoardStatsDatabase } from './helper';
//import { BoardDatabase, BoardStats } from './types';

import { DBHits, DBMisses } from './board';
import { saveBoardStatsDatabase } from './helper';
import { minimaxGame, Checkers } from './run';


//npx madge --circular --extensions ts ./

//let moveLimit: number = 15;
//let games: number = 0;
//let results: number[] = [];

//let boardStatsDatabase: BoardDatabase = getBoardStatsDatabase();

//for (let i=0; i < games; i++) {
//    results.push(minimaxGame(moveLimit));
    //results.push(minimaxGame(moveLimit));
//}

//console.log(results);

const checkers = new Checkers(60);

let s = performance.now();
checkers.train(5, 150)
console.log('training time - ', performance.now() - s);

console.log(DBHits, DBMisses, `${(DBHits/(DBHits+DBMisses))*100}%`)

//Initiallise the opening book of board stats
//checkers.generateOpeningBookPositions(8)

//saveBoardStatsDatabase();

/*
depth: 9
{
    '0': 7.5,
    '1': 7,
    '2': 7.5,
    '3': 8.5,
    '4': 7,
    '5': 6,
    '6': 5.5,
    '7': 7
  }
  training time -  4884443.0424000025
  2391433258 4582844 99.808730667704%


depth 4
{
  '0': 58,
  '1': 44,
  '2': 53,
  '3': 49.5,
  '4': 54,
  '5': 53.5,
  '6': 41.5,
  '7': 42.5,
  '8': 47,
  '9': 43,
  '10': 53,
  '11': 51.5,
  '12': 35.5,
  '13': 55.5,
  '14': 49.5,
  '15': 53.5,
  '16': 46,
  '17': 45.5,
  '18': 46.5,
  '19': 52,
  '20': 53.5,
  '21': 44.5,
  '22': 53.5,
  '23': 45,
  '24': 55,
  '25': 51.5,
  '26': 41,
  '27': 52.5,
  '28': 42.5,
  '29': 45,
  '30': 47,
  '31': 52,
  '32': 48.5,
  '33': 47.5,
  '34': 47.5,
  '35': 51.5,
  '36': 43.5,
  '37': 52,
  '38': 52,
  '39': 53.5,
  '40': 50.5,
  '41': 45.5,
  '42': 54.5,
  '43': 49,
  '44': 49,
  '45': 57,
  '46': 48,
  '47': 42,
  '48': 52.5,
  '49': 48.5
}
training time -  528312.5020999908
275321080 2331250 99.16037081338376%


depth 5
{
  '0': 56,
  '1': 65.5,
  '2': 64.5,
  '3': 54,
  '4': 49,
  '5': 56.5,
  '6': 57,
  '7': 52,
  '8': 59,
  '9': 53.5,
  '10': 57.5,
  '11': 66.5,
  '12': 51.5,
  '13': 58,
  '14': 59,
  '15': 68,
  '16': 56.5,
  '17': 65.5,
  '18': 53.5,
  '19': 54.5,
  '20': 52.5,
  '21': 55,
  '22': 57,
  '23': 62,
  '24': 56.5,
  '25': 61.5,
  '26': 55.5,
  '27': 61.5,
  '28': 65,
  '29': 68,
  '30': 59,
  '31': 58.5,
  '32': 63.5,
  '33': 60,
  '34': 56.5,
  '35': 59,
  '36': 54,
  '37': 57,
  '38': 63,
  '39': 53.5,
  '40': 65,
  '41': 56,
  '42': 58.5,
  '43': 62,
  '44': 56.5,
  '45': 58.5,
  '46': 62.5,
  '47': 60,
  '48': 68,
  '49': 51,
  '50': 61.5,
  '51': 57.5,
  '52': 60,
  '53': 69.5,
  '54': 54.5,
  '55': 64.5,
  '56': 67,
  '57': 59,
  '58': 63,
  '59': 49.5
}
training time -  3758048.428799987
1840809725 7793817 99.57839434887332%
*/
