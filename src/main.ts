

// added a second test bot with more intelligent parameters.
// the more naive bot has about a 90% winrate in genereation 1
// and by about generation 10 the population tends to have 0 losses agianst it.
// And the intelligent bot that favours the parameters you would expect to be strong 

// added lost of changes for features like logging each population
// and the ability to load a population into the program from the log file and train from there

// added an evaluation database stored with each bot. Gets about a 30% hitrate and speeds
// up training by about 20%

// all I have left to do is some unit testing and graph generation and then running training
// until I have a good enough bot. Also I haven't quite finished the code for a user to play 
// against the bot so I need to do that too


import { EvalHit, EvalMiss } from './ai';
import { DBHits, DBMisses } from './board';
import { getTime, roundTo, writeToFile } from './helper';
//import { boardStatsDatabase, getTime, roundTo, writeToFile } from './helper';
//import { boardStatsDatabase } from './database';
//import { saveBoardStatsDatabase } from './helper';
import { Checkers } from './run';


//npx madge --circular --extensions ts ./



const checkers = new Checkers();

//checkers.getPopulationFromJSONFile();


// An example data object
//const data = [
//  { name: 'John', age: 28 },
//  { name: 'Jane', age: 32 },
//  { name: 'Bob', age: 45 }
//];

// Log the data to the console using console.table()
//console.table(data);

// Write the output to a file
//writeToFile('test1.txt', JSON.stringify(data));

//console.log("done")

const formattedDate: string = new Date().toLocaleString().replace(/:/g, '-').replace(/\//g, '-').replace(/ /g, '_').replace(/,/g, '');
console.log(formattedDate); // Output: 3/8/2023, 11:42:17 AM
writeToFile('testScores_log.txt', '\n\n'.concat(formattedDate));

//const now = new Date();
//const hours = now.getHours().toString().padStart(2, '0');
//const minutes = now.getMinutes().toString().padStart(2, '0');
//const seconds = now.getSeconds().toString().padStart(2, '0');
//const time = `${hours}-${minutes}-${seconds}`;
const time = getTime();
console.log(time);


let s1 = performance.now();
checkers.generatePreloadedDatabase()
console.log(`Opening book generated in ${performance.now() - s1}ms`);

let s2 = performance.now();
checkers.train({ trainingMethod: 'Experiment1'});

//let logInstance = '30-04-2023_21-05-49' //'11-04-2023_00-56-00'
//checkers.continueTrainingFromJSONFile('Experiment1', `log_${logInstance}.txt`, 20)


/*(async () => {
	for (let i = 0; i < 5; i++) {
		console.log(`SIMULATION ${i+1}`)
		await checkers.continueTrainingFromJSONFile('STP4', 'log_08-04-2023_17-43-50.txt', 26)
	}
	console.log('training time - ', performance.now() - s2);
	console.log(`${roundTo(DBHits/(DBHits+DBMisses), 2)*100}% DB Hitrate`)
	console.log(EvalHit, EvalMiss, `${roundTo(EvalHit/(EvalHit+EvalMiss), 2)*100}% Eval Hitrate`)
})();*/

//for (let i=0; i<10; i++) {
//    console.log(`SIMULATION ${i+1}`)
//    checkers.continueTrainingFromJSONFile('STP4', 'log_08-04-2023_17-43-50.txt', 26)
//}
//checkers.continueTrainingFromJSONFile('STP4', 'log_31-03-2023_13-21-49.txt', 19)
//checkers.continueTrainingFromJSONFile('STP3', 'log_28-03-2023_15-08-07.txt', 25)
//checkers.continueTrainingFromJSONFile('STP3', 'log_28-03-2023_22-45-26.txt', 28)
//checkers.continueTrainingFromJSONFile('STP3', 'log_31-03-2023_01-15-25.txt', 14)
console.log('training time - ', performance.now() - s2);

//checkers.trial();

//checkers.testFromJSONFile();

//checkers.train({ standard: false, generations: 2, moveLimit: 200, depth: 7, populationSize: 10 })

//checkers.test();


console.log(DBHits, DBMisses, `${roundTo(DBHits/(DBHits+DBMisses), 2)*100}% DB Hitrate`)
console.log(EvalHit, EvalMiss, `${roundTo(EvalHit/(EvalHit+EvalMiss), 2)*100}% Eval Hitrate`)

//TODO implement function to restart from latest generation in gen log file


//console.log(DBHits, DBMisses, `${(DBHits/(DBHits+DBMisses))*100}%`)

//Initiallise the opening book of board stats
//checkers.generateOpeningBookPositions(8)

//saveBoardStatsDatabase();



//{"standard":true,"trainingMethod":"RR","generations":30}0[{"score":0.04,"wins":4,"losses":71,"draws":25}]1[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19}]2[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23}]3[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23},{"score":0.275,"wins":11,"losses":6,"draws":23}]4[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23},{"score":0.275,"wins":11,"losses":6,"draws":23},{"score":0.25,"wins":10,"losses":5,"draws":25}]5[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23},{"score":0.275,"wins":11,"losses":6,"draws":23},{"score":0.25,"wins":10,"losses":5,"draws":25},{"score":0.25,"wins":10,"losses":6,"draws":24}]6[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23},{"score":0.275,"wins":11,"losses":6,"draws":23},{"score":0.25,"wins":10,"losses":5,"draws":25},{"score":0.25,"wins":10,"losses":6,"draws":24},{"score":0.275,"wins":11,"losses":8,"draws":21}]7[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23},{"score":0.275,"wins":11,"losses":6,"draws":23},{"score":0.25,"wins":10,"losses":5,"draws":25},{"score":0.25,"wins":10,"losses":6,"draws":24},{"score":0.275,"wins":11,"losses":8,"draws":21},{"score":0.475,"wins":19,"losses":3,"draws":18}]8[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23},{"score":0.275,"wins":11,"losses":6,"draws":23},{"score":0.25,"wins":10,"losses":5,"draws":25},{"score":0.25,"wins":10,"losses":6,"draws":24},{"score":0.275,"wins":11,"losses":8,"draws":21},{"score":0.475,"wins":19,"losses":3,"draws":18},{"score":0.675,"wins":27,"losses":1,"draws":12}]9[{"score":0.04,"wins":4,"losses":71,"draws":25},{"score":0.075,"wins":6,"losses":55,"draws":19},{"score":0.2,"wins":10,"losses":17,"draws":23},{"score":0.275,"wins":11,"losses":6,"draws":23},{"score":0.25,"wins":10,"losses":5,"draws":25},{"score":0.25,"wins":10,"losses":6,"draws":24},{"score":0.275,"wins":11,"losses":8,"draws":21},{"score":0.475,"wins":19,"losses":3,"draws":18},{"score":0.675,"wins":27,"losses":1,"draws":12},{"score":0.425,"wins":17,"losses":2,"draws":21}]

/*
[
  { score: 0.04, wins: 4, losses: 72, draws: 24 },
  { score: 0.0875, wins: 7, losses: 49, draws: 24 },
  { score: 0.08, wins: 4, losses: 32, draws: 14 },
  { score: 0.075, wins: 3, losses: 25, draws: 12 },
  { score: 0.125, wins: 5, losses: 24, draws: 11 },
  { score: 0.225, wins: 9, losses: 17, draws: 14 },
  { score: 0.2, wins: 8, losses: 18, draws: 14 },
  { score: 0.225, wins: 9, losses: 11, draws: 20 },
  { score: 0.225, wins: 9, losses: 7, draws: 24 },
  { score: 0.3, wins: 12, losses: 12, draws: 16 },
  { score: 0.185, wins: 37, losses: 62, draws: 101 }
]
training time -  4428678.6501
100% DB Hitrate






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
