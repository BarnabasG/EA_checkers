import { EvalHit, EvalMiss } from './ai';
import { DBHits, DBMisses } from './board';
import { roundTo, writeToFile } from './helper';
import { Checkers } from './run';


const checkers = new Checkers();


const formattedDate: string = new Date().toLocaleString().replace(/:/g, '-').replace(/\//g, '-').replace(/ /g, '_').replace(/,/g, '');
console.log(formattedDate);
writeToFile('testScores_log.txt', '\n\n'.concat(formattedDate));

let s1 = performance.now();
checkers.generatePreloadedDatabase(8, 9, 6)
console.log(`Database generated in ${performance.now() - s1}ms`);

let s2 = performance.now();
checkers.train({ trainingMethod: 'testPattern'});

//let logInstance = '03-05-2023_11-19-19'
//checkers.continueTrainingFromFile('Experiment1', `log_${logInstance}.txt`, 5)

console.log('training time - ', performance.now() - s2);


console.log(DBHits, DBMisses, `${roundTo(DBHits/(DBHits+DBMisses), 2)*100}% DB Hitrate`)
console.log(EvalHit, EvalMiss, `${roundTo(EvalHit/(EvalHit+EvalMiss), 2)*100}% Eval Hitrate`)