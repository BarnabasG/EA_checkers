import Benchmark from 'benchmark';
import { Player, Status, WeightSet } from "../src/types";
import { Population } from "../src/population";
import { CheckersGame } from '../src/checkers';
import { minimax } from '../src/ai';
import { HashMap } from '../src/database';
import { checkDraw } from '../src/helper';


const runConfig = {
	"reverseBits": true,
	"getBestNMembers": true,
	"keys": true,
	"popRandom": true,
	"compete": true,
	"competeDeep": false,
	"permutations": true
}


const testSuites: Map<string, Benchmark.Suite> = new Map();


function generateKey(value: number, king: number): string {
    return `${value}/${value & king}`;
}

function generateKeyComplete(white: number, black: number, king: number): string {
    return `${white}/${black}/${king}`;
}


if (runConfig.keys) {

	var suite = new Benchmark.Suite;

	const white = 0b01000000000000000000000011110000;
	const black = 0b00001111000000000000000000000010;
	const king =  0b01000110000000000000000001100010;

	suite
		.add('one colour key', function() {
			generateKey(white, king);
		})
		.add('complete key', function() {
			generateKeyComplete(white, black, king);
		})
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('keys', suite)
} else {
	console.log("Skipping keys")
}



function reverseBits(x: number) {
	x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
	x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
	x = ((x >> 4) & 0x0F0F0F0F) | ((x & 0x0F0F0F0F) << 4);
	x = ((x >> 8) & 0x00FF00FF) | ((x & 0x00FF00FF) << 8);
	x = (x >>> 16) | (x << 16);

	return x >>> 0;
}


if (runConfig.reverseBits) {
	var suite = new Benchmark.Suite;

	const reverseBitInput = 0b01000000001010000000100011110001;
	const reverseBitInput2 = 0b11111111111111111111111111111111;
	const reverseBitInput3 = 0b00000000000000000000000000000000;

	suite.add('reverseBits', function() {
			reverseBits(reverseBitInput);
		})
		.add('reverseBits2', function() {
			reverseBits(reverseBitInput2);
		})
		.add('reverseBits3', function() {
			reverseBits(reverseBitInput3);
		})
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('resverseBits', suite)
} else {
	console.log("Skipping reverseBits")
}




function getBestNMembers(n: number, pop: Map<number, WeightSet>): number[] {
	const ranked = [...pop.entries()].sort((a, b) => b[1].score - a[1].score);
	const topNPairs = ranked.slice(0, n);
	const topNKeys = topNPairs.map(pair => pair[0]);
	return topNKeys;
}

let p1 = new Population({populationSize: 100});
p1.population.forEach(element => {
	element.score = Math.random();
});

let p2 = new Population({populationSize: 1000});
p2.population.forEach(element => {
	element.score = Math.random();
});

if (runConfig.getBestNMembers) {
	//console.log("Running getBestNMembers")

	var suite = new Benchmark.Suite;

	suite
		.add('getBestNMembers', function() {
			getBestNMembers(10, p1.population);
		})
		.add('getBestNMembers', function() {
			getBestNMembers(90, p1.population);
		})
		.add('getBestNMembers', function() {
			getBestNMembers(10, p2.population);
		})
		.add('getBestNMembers', function() {
			getBestNMembers(900, p2.population);
		})
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('getBestNMembers', suite);
} else {
	console.log("Skipping getBestNMembers")
}


function popRandom<T>(array: T[]): T | undefined {
    if (array.length === 0) {
      return undefined;
    }
    const index = Math.floor(Math.random() * array.length);
    return array.splice(index, 1)[0];
}


const arr1 = [...Array(100).keys()];
const arr2 = [...Array(10000).keys()];
const arr3 = [...Array(100).keys()].map(x => x.toString());
const arr4 = [...Array(10000).keys()].map(x => x.toString());


if (runConfig.popRandom) {

	var suite = new Benchmark.Suite;

	suite
		.add('popRandom1', function() {
			popRandom(arr1);
		})
		.add('popRandom2', function() {
			popRandom(arr2);
		})
		.add('popRandom3', function() {
			popRandom(arr3);
		})
		.add('popRandom4', function() {
			popRandom(arr4);
		})
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('popRandom', suite);
} else {
	console.log("Skipping popRandom")
}



//Compete

function compete(indexes: number[], moveLimit: number, depth: number, population: Map<number, WeightSet>, boardStatsDatabase: HashMap = new HashMap()): number {

	let checkers = new CheckersGame();
	let status = 0;
	let moveIndex = 0;

	let boardStack: number[][] = [];
	let nonManMoves: number = 0;


	while (moveIndex !== moveLimit) {
		let moves = checkers.getMoves();
		status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
		if (status !== 0) {
			return status;
		}
		let move = minimax(checkers, depth, population, checkers.player === Player.WHITE ? indexes[0] : indexes[1], boardStatsDatabase);
		checkers = checkers.makeMove(move);

		(move.end & checkers.board.king) && !move.captures ? nonManMoves++ : nonManMoves = 0;
		boardStack.push([checkers.board.white, checkers.board.black, checkers.board.king]);
		if (boardStack.length > 10) boardStack.shift();

		let s = checkDraw(boardStack, nonManMoves)
		if (s !== Status.PLAYING) {
			return s;
		}

		moveIndex++;
	}

	return Status.DRAW_MOVELIMIT;
	
	
}


const pop = new Population({testPopulation: true})
const moveLimit = 200;
const indexes = [0, 1];

if (runConfig.compete) {

	var suite = new Benchmark.Suite;

	suite
		.add('compete depth 1', function() {
			compete(indexes, moveLimit, 1, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 2', function() {
			compete(indexes, moveLimit, 2, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 3', function() {
			compete(indexes, moveLimit, 3, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 4', function() {
			compete(indexes, moveLimit, 4, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 5', function() {
			compete(indexes, moveLimit, 5, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 6', function() {
			compete(indexes, moveLimit, 6, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 7', function() {
			compete(indexes, moveLimit, 7, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 8', function() {
			compete(indexes, moveLimit, 8, pop.population);
			pop.clearDatabases();
		})
		.add('compete depth 9', function() {
			compete(indexes, moveLimit, 9, pop.population);
			pop.clearDatabases();
		})
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('compete', suite);
	//suite.run({async: true});

	if (runConfig.competeDeep) {
		console.log('Running Deep Compete (depth 4-10)');
		for (let i = 4; i <= 6; i++) {
			let c = 0;
			let r = Status.PLAYING;
			for (let j = 0; j < 12; j++) {
				let s = performance.now();
				r = compete(indexes, moveLimit, i, pop.population);
				c += performance.now() - s;
				pop.clearDatabases();
			}
			console.log('result', Status[r], i, c / 12);
		}
		for (let i = 7; i <= 8; i++) {
			let c = 0;
			let r = Status.PLAYING;
			for (let j = 0; j < 8; j++) {
				let s = performance.now();
				r = compete(indexes, moveLimit, i, pop.population);
				c += performance.now() - s;
				pop.clearDatabases();
			}
			console.log('result', Status[r], i, c / 8);
		}
		for (let i = 9; i <= 9; i++) {
			let c = 0;
			let r = Status.PLAYING;
			for (let j = 0; j < 5; j++) {
				let s = performance.now();
				r = compete(indexes, moveLimit, i, pop.population);
				c += performance.now() - s;
				pop.clearDatabases();
			}
			console.log('result', Status[r], i, c / 5);
		}

		let c = 0;
		let r = Status.PLAYING;
		for (let j = 0; j < 3; j++) {
			let s = performance.now();
			r = compete(indexes, moveLimit, 10, pop.population);
			c += performance.now() - s;
			console.log('10', Status[r], performance.now() - s)
			pop.clearDatabases();
		}
		console.log('result', Status[r], 10, c / 3);
	}


} else {
	console.log("Skipping compete")
}





//permutations

function permutations(arr: number[], len: number = arr.length): number[][] {
	
    len = len || arr.length;
    if(len > arr.length) len = arr.length;
    const results: any[] = [];
  
    function eliminate(el: number, arr: number[]) {
        let i = arr.indexOf(el);
        arr.splice(i, 1);
        return arr;
    }
  
    function perms(arr: number[], len: number, prefix: any[] = []) {
        if (prefix.length === len) {
            results.push(prefix);
        } else {
            for (let elem of arr) {
                let newPrefix = [...prefix];
                newPrefix.push(elem);
                let newRest = null;
                newRest = eliminate(elem, [...arr]);
                perms(newRest, len, newPrefix);
            }
        }
        return;
    }
    perms(arr, len);

    return results;
}

const arr1Perms = [...Array(10).keys()]
const arr2Perms = [...Array(50).keys()]
const arr3Perms = [...Array(200).keys()]
const arr4Perms = [...Array(1000).keys()]


const len1Perms = 2;


if (runConfig.permutations) {

	var suite = new Benchmark.Suite;

	suite
		.add('permutations 1.1', function() {
			permutations(arr1Perms, len1Perms);
		})
		.add('permutations 2.1', function() {
			permutations(arr2Perms, len1Perms);
		})
		.add('permutations 3.1', function() {
			permutations(arr3Perms, len1Perms);
		})
		.add('permutations 4.1', function() {
			permutations(arr4Perms, len1Perms);
		})
		
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('permutations', suite);

} else {
	console.log("Skipping permutations")
}






async function runBenchmarkSuites(suiteMap: Map<string, Benchmark.Suite>): Promise<void> {
	for (const [suiteName, suite] of suiteMap.entries()) {
		console.log(`Running suite: ${suiteName}`);
		await new Promise<void>((resolve) => {
			suite.on("complete", () => {
				console.log(`Finished suite: ${suiteName}`);
				resolve();
			});
			suite.run({ async: true });
		});
	}
}
runBenchmarkSuites(testSuites);