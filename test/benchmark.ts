//var Benchmark = require('benchmark');
import Benchmark from 'benchmark';
import { BoardStats, WeightInit, WeightSet } from "../src/types";
//import { CheckersGame } from "../src/checkers";
import { Population } from "../src/population";


import { BloomFilter } from 'bloom-filters'

const runConfig = {
	"reverseBits": false,
	"getBestNMembers": false,
	"keys": false,
	"bloomFilter": true,
}


const testSuites: Map<string, Benchmark.Suite> = new Map();


/*var Benchmark = require('benchmark');

import { CheckersGame } from "./src/checkers";
function permute1(arr: any[], length: number = arr.length) {
	var result = [arr.slice()],
		c = new Array(length).fill(0),
		i = 1, k, p;
	
	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			p = arr[i];
			arr[i] = arr[k];
			arr[k] = p;
			++c[i];
			i = 1;
			result.push(arr.slice());
		} else {
			c[i] = 0;
			++i;
		}
	}
	return result;
}

var swap = function (array, pos1, pos2) {
	var temp = array[pos1];
	array[pos1] = array[pos2];
	array[pos2] = temp;
};

var permute2 = function (array, n = array.length, results = []) {
  //n = n || array.length;
	if (n === 1) {
		results.push(array.slice());
	} else {
		for (var i = 1; i <= n; i += 1) {
		permute2(array, n - 1, results);
		if (n % 2) {
			var j = 1;
		} else {
			var j = i;
		}
		swap(array, j - 1, n - 1);
		}
	}
	return results;
};

function permute3(xs) {
	if (!xs.length) return [[]];
	return xs.flatMap(x => {
	  return permute3(xs.filter(v => v!==x)).map(vs => [x, ...vs]);
	});
}

function permute4(arr, perms = [], len = arr.length) {
    if (len === 1) perms.push(arr.slice(0))
    for (let i = 0; i < len; i++) {
        permute4(arr, perms, len - 1)
        len % 2 // parity dependent adjacent elements swap
            ? [arr[0], arr[len - 1]] = [arr[len - 1], arr[0]]
            : [arr[i], arr[len - 1]] = [arr[len - 1], arr[i]]
    }
    return perms
}

function permute5(arr, len = 3) {
	
    len = len || arr.length;
    if(len > arr.length) len = arr.length;
    const results = [];
  
    function eliminate(el, arr) {
        let i = arr.indexOf(el);
        arr.splice(i, 1);
        return arr;
    }
  
    function perms(arr, len, prefix = []) {
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


var suite = new Benchmark.Suite;
var input = [0, 1, 2, 3, 4];

suite.add('permute_1', function() {
    	permute1(input);
 	 })
  	.add('permute_2', function() {
    	permute2(input);
  	})
  	.add('permute_3', function() {
		permute3(input);
  	})
	.add('permute_4', function() {
		permute4(input);
	})
	.add('permute_5', function() {
		permute5(input);
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	.run({async: true});
*

//////

function weightedRandom1(values: any[], weights: number[]): any {
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let randomNum = Math.random() * totalWeight;
  
    for (let i = 0; i < values.length; i++) {
        if (randomNum < weights[i]) {
            return values[i];
        }
        randomNum -= weights[i];
    }
  
    // All weights are 0 or negative
    throw new Error('All weights are 0 or negative');
}

function weightedRandom2(values: any[], weights: number[], n: number): any[] {
    if (values.length !== weights.length) {
        throw new Error('Values and weights arrays must be of equal length.');
    }
  
    const weightedValues: [any, number][] = values.map((value, index) => [value, weights[index]]);
    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const result: any[] = [];
  
    while (n > 0 && weightedValues.length > 0) {
        let rand = Math.random() * totalWeight;
        let i = 0;
    
        while (rand > 0 && i < weightedValues.length) {
            rand -= weightedValues[i][1];
            i++;
        }
    
        i--;
        result.push(weightedValues[i][0]);
        totalWeight -= weightedValues[i][1];
        weightedValues.splice(i, 1);
        n--;
    }
  
    return result;
}

function weightedRandom3(values: any[], weights: number[], n: number): any[] {
    const weightedValues = values.map((value, index) => [value, weights[index]]);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return Array.from({ length: n }, () => {
        let rand = Math.random() * totalWeight;
        return weightedValues.find(([value, weight]) => (rand -= weight) < 0)?.[0];
    });
}

function weightedRandom4<T>(values: T[], weights: number[], n: number): T[] {
	const nValues = values.length;
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	const normWeights = weights.map((weight) => weight / totalWeight);
  
	const aliasTable: number[] = [];
	const probTable: number[] = [];
	const small: number[] = [];
	const large: number[] = [];
	for (let i = 0; i < nValues; i++) {
		const prob = normWeights[i] * nValues;
		if (prob < 1) {
			small.push(i);
		} else {
			large.push(i);
		}
		probTable[i] = prob;
		aliasTable[i] = i;
	}
  
	while (small.length > 0 && large.length > 0) {
		const l = small.pop()!;
		const g = large.pop()!;
		probTable[l] = normWeights[l] * nValues;
		aliasTable[l] = g;
		probTable[g] = probTable[g] + probTable[l] - 1;
		if (probTable[g] < 1) {
			small.push(g);
		} else {
			large.push(g);
		}
	}
  
	const result: T[] = [];
	for (let i = 0; i < n; i++) {
		const r = Math.floor(Math.random() * nValues);
		const prob = probTable[r];
		if (Math.random() < prob) {
			result.push(values[r]);
		} else {
			result.push(values[aliasTable[r]]);
		}
	}
  
	return result;
}

function weightedRandom5<T>(values: T[], weights: number[], n: number): T[] {
	const nValues = values.length;
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	const normWeights = weights.map((weight) => weight / totalWeight);
  
	const aliasTable: number[] = [];
	const probTable: number[] = [];
	let small: number[] = [];
	let large: number[] = [];
	for (let i = 0; i < nValues; i++) {
	  const prob = normWeights[i] * nValues;
	  probTable.push(prob);
	  aliasTable.push(i);
	  (prob < 1 ? small : large).push(i);
	}
  
	while (small.length && large.length) {
	  const l = small.pop()!;
	  const g = large.pop()!;
	  aliasTable[l] = g;
	  probTable[g] += probTable[l] - 1;
	  (probTable[g] < 1 ? small : large).push(g);
	}
  
	const result: T[] = [];
	const selected = new Set<number>();
	while (result.length < n) {
	  const r = Math.floor(Math.random() * nValues);
	  const prob = probTable[r];
	  if (Math.random() < prob && !selected.has(r)) {
		result.push(values[r]);
		selected.add(r);
	  } else if (!selected.has(aliasTable[r])) {
		result.push(values[aliasTable[r]]);
		selected.add(aliasTable[r]);
	  }
	}
  
	return result;
}
  


var suite2 = new Benchmark.Suite;
//var input2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let keys: number[] = [];
let values: number[] = [];

for (let i = 0; i < 10; i++) {
  keys.push(i);
  values.push(Math.random());
}

//console.log(keys);
//console.log(values);

suite2.add('rand_2', function() {
		weightedRandom2(keys, values, 5);
	})
	.add('rand_3', function() {
		weightedRandom3(keys, values, 5);
	})
	.add('rand_4', function() {
		weightedRandom4(keys, values, 5);
	})
	.add('rand_5', function() {
		weightedRandom5(keys, values, 5);
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	//.run({async: true});

const myMap = new Map();
myMap.set("key1", "value1");
myMap.set("key2", "value2");
myMap.set("key3", "value3");

// Using Array.from()
const keyList = Array.from(myMap.keys());
console.log(keyList); // Output: ["key1", "key2", "key3"]

// Using spread syntax
const keyList2 = [...myMap.keys()];
console.log(keyList2); // Output: ["key1", "key2", "key3"]

console.log(myMap)
console.log(myMap.keys())
console.log(myMap.values())
console.log(myMap.entries())
console.log(myMap['key1'])
*/

//import { Benchmark } from "vitest";

//import { generateKey, generateKeyComplete, getWeights, pad } from "./src/helper";


//var checkers = new CheckersGame()


/*function colourKey1() {
	//return generateKey(checkers.board.white, checkers.board.white & checkers.board.king);
	return generateKey(checkers.board.white, checkers.board.king);
	//generateKey(checkers.board.black, checkers.board.black & checkers.board.king);
}

function colourKey2() {
	return JSON.stringify({0:checkers.board.white, 1:checkers.board.white & checkers.board.king});
	//JSON.stringify({0:checkers.board.black, 1:checkers.board.black & checkers.board.king});
}

function colourKey3() {
	return `${checkers.board.white}/${checkers.board.king}`;
}

function colourKey4() {
	let key = '';
    for (let index = 0; index < 32; index++) {
        let bitPiece = checkers.board.white & (1 << index)
        let bitKing = (checkers.board.white & checkers.board.king) & (1 << index)
        key += bitPiece ? bitKing ? 'K' : 'P' : '0';
    }
	return key;
}*/

function generateKey(value: number, king: number): string {
    return `${value}/${value & king}`;
}

//function generateKey2(value: number, king: number): string {
//    return `${value}/${king}`;
//}

function generateKeyComplete(white: number, black: number, king: number): string {
    return `${white}/${black}/${king}`;
}



/*function completeKey1() {
	return generateKeyComplete(checkers.board.white, checkers.board.black, checkers.board.king)
}

function completeKey2() {
	return JSON.stringify(checkers.board);
}

function completeKey3() {
	return JSON.stringify({0:checkers.board.white, 1:checkers.board.black, 2:checkers.board.king});
}

function completeKey4() {
	return `${checkers.board.white}/${checkers.board.black}/${checkers.board.king}`;
}

function completeKey5() {
	let key = '';
    for (let index = 0; index < 32; index++) {
        let bitWhite = checkers.board.white & (1 << index)
        let bitBlack = checkers.board.black & (1 << index)
        let bitKing = checkers.board.king & (1 << index)
        if (bitWhite) {
            if (bitKing) {
                key += 'W';
            } else {
                key += 'w'; 
            }
        } else if (bitBlack) {
            if (bitKing) {
                key += 'B';
            } else {
                key += 'b'; 
            }
        } else {
            key += '0';
        }
    }
	return key;
}*/


if (runConfig.keys) {
	//console.log("Running key benchmarks")

	var suite = new Benchmark.Suite;
	//const boardStats = getWeights(WeightInit.RANDOM)

	const white = 0b01000000000000000000000011110000;
	const black = 0b00001111000000000000000000000010;
	const king =  0b01000110000000000000000001100010;

	suite
		.add('one colour key', function() {
			generateKey(white, king);
		})
		//.add('one colour key', function() {
		//	generateKey2(white, king);
		//})
		.add('complete key', function() {
			generateKeyComplete(white, black, king);
		})
		/*.add('colourKey1', function() {
			colourKey1();
		})
		.add('colourKey2', function() {
			colourKey2();
		})
		.add('colourKey3', function() {
			colourKey3();
		})
		.add('colourKey4', function() {
			colourKey4();
		})
		.add('completeKey1', function() {
			completeKey1();
		})
		.add('completeKey2', function() {
			completeKey2();
		})
		.add('completeKey3', function() {
			completeKey3();
		})
		.add('completeKey4', function() {
			completeKey4();
		})
		.add('completeKey5', function() {
			completeKey5();
		})*/
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	//suite.run({async: true});
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
	//console.log("Running reverseBits")
	var suite = new Benchmark.Suite;

	const reverseBitInput = 0b01000000000000000000000011110000;
	//const reverseBitInput = 0b11000111100011111100000011110001;


	suite.add('reverseBits', function() {
			reverseBits(reverseBitInput);
		})
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('resverseBits', suite)
	//suite.run({async: true});
} else {
	console.log("Skipping reverseBits")
}







/*
function getRandomSampleOrig<T>(arr: T[], sampleSize: number): T[] {
	const sample: T[] = [];
	const copiedArray = [...arr]; // create a copy of the original array
	
	while (sample.length < sampleSize && copiedArray.length > 0) {
		const randomIndex = Math.floor(Math.random() * copiedArray.length);
		sample.push(copiedArray[randomIndex]);
		copiedArray.splice(randomIndex, 1); // remove the selected element from the copied array
	}
	
	return sample;
}

function getRandomSample1<T>(arr: T[], sampleSize: number): T[] {
	if (sampleSize >= arr.length) {
		return arr.slice();
	}
	
	const sample: T[] = [];
	
	for (let i = 0; i < sampleSize; i++) {
		const randomIndex = Math.floor(Math.random() * (arr.length - i));
		sample.push(arr[randomIndex]);
		arr[randomIndex] = arr[arr.length - i - 1];
	}
	
	return sample;
}

function getRandomSample5<T>(arr: T[], sampleSize: number): T[] {
	if (sampleSize >= arr.length) {
	  return [...arr]
	  //return arr.slice();
	}

	
	if (sampleSize > arr.length / 2) {

		//const indexRemovals: number[] = [];
		const copiedArray = [...arr]; // create a copy of the original array
	
		for (let i = 0; i < sampleSize; i++) {
			const randomIndex = Math.floor(Math.random() * copiedArray.length);
			//sample.push(copiedArray[randomIndex]);
			copiedArray.splice(randomIndex, 1); // remove the selected element from the copied array
		}

	  	return copiedArray;
	}

	const sample: T[] = [];
	for (let i = 0; i < sampleSize; i++) {
		const randomIndex = Math.floor(Math.random() * (arr.length - i));
		sample.push(arr[randomIndex]);
		arr[randomIndex] = arr[arr.length - i - 1];
	}
	return sample;
}

function getRandomSample4<T>(arr: T[], sampleSize: number): T[] {
	const n = arr.length;
	if (sampleSize >= n) {
	  return arr.slice();
	}
  
	const sample: T[] = new Array(sampleSize);
	let i = 0;
	let k = 0;
	while (i < n && k < sampleSize) {
		const j = Math.floor(Math.random() * (n - i));
		if (j < sampleSize - k) {
			sample[k++] = arr[i];
		}
		i++;
	}
	return sample;
}

function getRandomSample2<T>(arr: T[], sampleSize: number): T[] {
	if (sampleSize >= arr.length) {
	  return [...arr]
	}

	const sample: T[] = [];
	for (let i = 0; i < sampleSize; i++) {
		const randomIndex = Math.floor(Math.random() * (arr.length - i));
		sample.push(arr[randomIndex]);
		arr[randomIndex] = arr[arr.length - i - 1];
	}
	return sample;
}

function getRandomSampleQQ<T>(arr: T[], sampleSize: number): T[] {
	const n = arr.length;
	if (sampleSize >= n) {
	  return arr.slice();
	}
  
	const sample: T[] = new Array(sampleSize);
	for (let i = 0; i < sampleSize; i++) {
		const randomIndex = Math.floor(Math.random() * (n - i));
		sample[i] = arr[randomIndex];
		arr[randomIndex] = arr[n - i - 1];
	}
	arr.length = n - sampleSize;
	return sample;
}

function getRandomSample<T>(arr: T[], sampleSize: number): T[] {
    const n = arr.length;
    if (sampleSize >= n) {
        return arr.slice();
    }

    const selectedIndices: Set<number> = new Set();
    const sample: T[] = new Array(sampleSize);

    for (let i = 0; i < sampleSize; i++) {
        let randomIndex: number;
        do {
            randomIndex = Math.floor(Math.random() * n);
        } while (selectedIndices.has(randomIndex));

        selectedIndices.add(randomIndex);
        sample[i] = arr[randomIndex];
    }

    return sample;
}


/*function getRandomSampleRemovers<T>(arr: T[], sampleSize: number): T[] {
	const sample: T[] = [];
	const copiedArray = [...arr]; // create a copy of the original array
	
	if (sampleSize > copiedArray.length / 2) {
		const indexes: number[] = [];
		while (indexes.length < copiedArray.length-sampleSize) {
			const randomIndex = Math.floor(Math.random() * copiedArray.length);
			indexes.push(randomIndex);
			copiedArray.splice(randomIndex, 1);
		}
	}
	while (sample.length < sampleSize && copiedArray.length > 0) {
		const randomIndex = Math.floor(Math.random() * copiedArray.length);
		sample.push(copiedArray[randomIndex]);
		copiedArray.splice(randomIndex, 1); // remove the selected element from the copied array
	}
	
	return sample;
}*

var suite = new Benchmark.Suite;

const arr1: number[] = [];
for (let i = 0; i < 1000; i++) {
	arr1.push(i);
}

const arr2: string[] = [];
for (let i = 0; i < 1000; i++) {
	arr2.push(String(i));
}

const arr3: any[] = [];
for (let i = 0; i < 1000; i++) {
	i%2 == 0 ? arr3.push(i) : arr3.push(String(i));
}

//console.log(getRandomSample(arr1, 10))
//console.log(getRandomSample(arr2, 10))
//console.log(getRandomSample(arr3, 10))
//console.log(getRandomSample(arr1, 900))
//console.log(getRandomSample(arr2, 900))
//console.log(getRandomSample(arr3, 900))

//console.log(arr1, arr2, arr3)

suite
	.add('sample number[], 10/1000', function() {
		getRandomSample(arr1, 10);
	})
	.add('sample string[], 10/1000', function() {
		getRandomSample(arr2, 10);
	})
	.add('sample any[], 10/1000', function() {
		getRandomSample(arr3, 10);
	})
	.add('sample number[], 100/1000', function() {
		getRandomSample(arr1, 100);
	})
	.add('sample string[], 100/1000', function() {
		getRandomSample(arr2, 100);
	})
	.add('sample any[], 100/1000', function() {
		getRandomSample(arr3, 100);
	})
	.add('sample number[], 900/1000', function() {
		getRandomSample(arr1, 900);
	})
	.add('sample string[], 900/1000', function() {
		getRandomSample(arr2, 900);
	})
	.add('sample any[], 900/1000', function() {
		getRandomSample(arr3, 900);
	})
	.add('sample any[], 1000/1000', function() {
		getRandomSample(arr3, 1000);
	})**
	.add('sample number[], 10/1000', function() {
		getRandomSample2(arr1, 10);
	})
	.add('sample string[], 10/1000', function() {
		getRandomSample2(arr2, 10);
	})
	.add('sample any[], 10/1000', function() {
		getRandomSample2(arr3, 10);
	})
	.add('sample number[], 100/1000', function() {
		getRandomSample2(arr1, 100);
	})
	.add('sample string[], 100/1000', function() {
		getRandomSample2(arr2, 100);
	})
	.add('sample any[], 100/1000', function() {
		getRandomSample2(arr3, 100);
	})
	.add('sample number[], 900/1000', function() {
		getRandomSample2(arr1, 900);
	})
	.add('sample string[], 900/1000', function() {
		getRandomSample2(arr2, 900);
	})
	.add('sample any[], 900/1000', function() {
		getRandomSample2(arr3, 900);
	})/**
	.add('sample any[], 1000/1000', function() {
		getRandomSample2(arr3, 1000);
	})

	.on('cycle', function(event: { target: any; }) {
		console.log(String(event.target));
	})
	//.on('complete', function() {
	//	console.log('Fastest is ' + this.filter('fastest').map('name'));
	//})
	//.run({async: true});
*/






function getBestNMembers(n: number, pop: Map<number, WeightSet>): number[] {
	const ranked = [...pop.entries()].sort((a, b) => b[1].score - a[1].score);
	const topNPairs = ranked.slice(0, n);
	const topNKeys = topNPairs.map(pair => pair[0]);
	return topNKeys;
}

function getBestNMembers2(n: number, pop: Map<number, WeightSet>): number[] {
    const topNKeys: number[] = new Array(n);
    const queue: [number, WeightSet][] = [];

    pop.forEach((weightSet, key) => {
        const score = weightSet.score;
        if (queue.length < n || score > queue[0][1].score) {
            if (queue.length === n) {
                queue.shift();
            }
            queue.push([key, weightSet]);
            queue.sort((a, b) => b[1].score - a[1].score);
        }
    });

    for (let i = 0; i < n; i++) {
        topNKeys[i] = queue[i][0];
    }

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

//console.log(getBestNMembers(10, p.population))
//console.log(getBestNMembers2(10, p.population))

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
	//suite.run({async: true});
} else {
	console.log("Skipping getBestNMembers")
}





type HashTable = {
    [key: string]: BoardStats;
}






class BloomHashMapBoardStatsOriginal {
    private filter: [number, BoardStats][]; // Array of [key, value] pairs
    private numElements: number;
    private readonly numHashFunctions: number;
    private readonly hashFunctions: ((key: number) => number)[];
  
    constructor(private size: number = 5_000_000) {
        this.filter = new Array(size);
        this.numElements = 0;
        this.hashFunctions = [
            (key) => (key * 17) % this.size,
            (key) => (key * 23) % this.size,
            (key) => (key * 29) % this.size,
            (key) => (key * 31) % this.size,
            (key) => (key * 37) % this.size,
            (key) => (key * 41) % this.size,
            (key) => (key * 43) % this.size,
        ];
        this.numHashFunctions = this.hashFunctions.length;
    }

  
    public put(key: number, value: BoardStats): void {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            this.filter[index] = [key, value];
        }
        this.numElements++;
    }

	/*public put(key: number, value: BoardStats): void {
		for (let i = 0; i < this.numHashFunctions; i++) {
			const index = this.hashFunctions[i](key);
			//this.filter[index] |= (1 << i);
			this.filter[index] = (this.filter[index] ? this.filter[index] : 0) | (1 << i);
		}
		this.numElements++;
	}*/
  
    public get(key: number): BoardStats | undefined {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            const pair = this.filter[index];
            if (pair === undefined || pair[0] !== key) {
                return undefined;
            }
        }
        const pair = this.filter[this.hashFunctions[0](key)];
        return pair[1];
    }

    public has(key: number): boolean {
        for (let i = 0; i < this.hashFunctions.length; i++) {
            const index = this.hashFunctions[i](key);
            const pair = this.filter[index];
            if (pair === undefined || pair[0] !== key) {
                return false;
            }
        }
        return true;
    }
  
    public getSize(): number {
        return this.numElements;
    }
  
    public isEmpty(): boolean {
        return this.numElements === 0;
    }
  
    public clear(): void {
        this.filter = new Array(this.size);
        this.numElements = 0;
    }
}

class MyBloomFilter {
    private filter: boolean[]; // Bit array
    private numElements: number;
    private readonly numHashFunctions: number;
    private readonly hashFunctions: ((key: number) => number)[];
  
    constructor(private size: number = 5_000_000) {
        this.filter = new Array(size).fill(false);
        this.numElements = 0;
        this.hashFunctions = [
            (key) => (key * 17) % this.size,
            (key) => (key * 23) % this.size,
            (key) => (key * 29) % this.size,
            (key) => (key * 31) % this.size,
            (key) => (key * 37) % this.size,
            (key) => (key * 41) % this.size,
            (key) => (key * 43) % this.size,
        ];
        this.numHashFunctions = this.hashFunctions.length;
    }

    public add(key: number): void {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            this.filter[index] = true;
        }
        this.numElements++;
    }

    public has(key: number): boolean {
        for (let i = 0; i < this.numHashFunctions; i++) {
            const index = this.hashFunctions[i](key);
            if (!this.filter[index]) {
                return false;
            }
        }
        return true;
    }
  
    public getSize(): number {
        return this.numElements;
    }
  
    public isEmpty(): boolean {
        return this.numElements === 0;
    }
  
    public clear(): void {
        this.filter.fill(false);
        this.numElements = 0;
    }
}

import BitArray from 'bitset';

class BloomHashMapBoardStats2 {
  private filter: BitArray;
  private numElements: number;
  private readonly numHashFunctions: number;
  private readonly hashFunctions: ((key: number) => number)[];

  constructor(private size: number = 5_000_000) {
    this.filter = new BitArray(size);
    this.numElements = 0;
    this.hashFunctions = [
      (key) => {
			const c1 = 0xcc9e2d51;
			const c2 = 0x1b873593;
			let hash = 0;
			let k = key;
			k *= c1;
			k = (k << 15) | (k >>> 17);
			k *= c2;
			hash ^= k;
			hash = (hash << 13) | (hash >>> 19);
			hash = (hash * 5) + 0xe6546b64;
			hash ^= 4;
			hash ^= hash >>> 16;
			hash *= 0x85ebca6b;
			hash ^= hash >>> 13;
			hash *= 0xc2b2ae35;
			hash ^= hash >>> 16;
			return hash;
		},
      (key) => {
			let hash = 0;
			const strKey = key.toString();
			for (let i = 0; i < strKey.length; i++) {
			hash += strKey.charCodeAt(i);
			hash += hash << 10;
			hash ^= hash >> 6;
			}
			hash += hash << 3;
			hash ^= hash >> 11;
			hash += hash << 15;
			return Math.floor(size * ((hash >>> 0) / 4294967296));
		},
      (key) => {
			let hash = 2166136261;
			for (let i = 0; i < 4; i++) {
			hash ^= (key & 0xff);
			hash *= 16777619;
			key >>= 8;
			}
			return hash;
		}
    ];
    this.numHashFunctions = this.hashFunctions.length;
  }

  public put(key: number, value: BoardStats): void {
    for (let i = 0; i < this.numHashFunctions; i++) {
		const index = this.hashFunctions[i](key);
		this.filter.set(index, 1);
		hashTable[key] = value;
    }
    this.numElements++;
  }

  public get(key: number): BoardStats | undefined {
    if (this.has(key)) {
		return hashTable[key];
    }
    return undefined;
  }

  public has(key: number): boolean {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const index = this.hashFunctions[i](key);
      if (!this.filter.get(index)) {
        return false;
      }
    }
    return true;
  }

  public getSize(): number {
    return this.numElements;
  }

  public isEmpty(): boolean {
    return this.numElements === 0;
  }

  public clear(): void {
    this.filter = new BitArray(this.size);
    this.numElements = 0;
  }
}

class BloomHashMapBoardStats3 {
	private filter: Uint32Array; // bit array
	private numElements: number;
	private readonly numHashFunctions: number;
	private readonly hashFunctions: ((key: number) => number)[];
	
	constructor(private size: number = 10_000_000) {
	  this.filter = new Uint32Array(Math.ceil(size / 32));
	  this.numElements = 0;
	  this.hashFunctions = [
		(key) => (key * 17) % size,
		(key) => (key * 23) % size,
		(key) => (key * 29) % size,
		(key) => (key * 31) % size,
		(key) => (key * 37) % size,
		//(key) => (key * 41) % size,
		//(key) => (key * 43) % size,
	  ];
	  this.numHashFunctions = this.hashFunctions.length;
	}
  
	public put(key: number, value: BoardStats): void {
	  for (let i = 0; i < this.numHashFunctions; i++) {
			const index = this.hashFunctions[i](key);
			this.filter[index >> 5] |= 1 << (index & 31);
	  }
	  hashTable[key] = value;
	  this.numElements++;
	}
	
	public get(key: number): BoardStats | undefined {
		/*(for (let i = 0; i < this.numHashFunctions; i++) {
			const index = this.hashFunctions[i](key);
			if ((this.filter[index >> 5] & (1 << (index & 31))) === 0) {
			return undefined;
			}
		}
		return new BoardStats(); // replace with actual implementation*/
		if (this.has(key)) {
			return hashTable[key];
		}
	}
  
	public has(key: number): boolean {
		for (let i = 0; i < this.numHashFunctions; i++) {
			const index = this.hashFunctions[i](key);
			if ((this.filter[index >> 5] & (1 << (index & 31))) === 0) {
			return false;
			}
		}
		return true;
	}
	
	public getSize(): number {
	  	return this.numElements;
	}
	
	public isEmpty(): boolean {
	  	return this.numElements === 0;
	}
	
	public clear(): void {
		this.filter = new Uint32Array(Math.ceil(this.size / 32));
		this.numElements = 0;
	}
}

class BloomFilterHashMap extends BloomFilter {
	private readonly hashmap: { [key: string]: BoardStats } = {};

	public put(key: string, value: any): void {
		this.hashmap[key] = value;
		super.add(key);
	}
}


let hashTable: HashTable = {};
let bloomFilter = new BloomFilterHashMap(5_000_000, 7);
//let bloomFilter = new BloomHashMapBoardStats();
const randomStats = getRandomBoardStats();

function randomNeg(minmax: number = 1) : number {
    return Math.random() * (Math.round(Math.random()) ? 1 : -1) * minmax;
}

function getRandomBoardStats(): BoardStats {
    return {
        pieces: randomNeg(2),
        kings: randomNeg(2),
        avrDist: randomNeg(2),
        backline: randomNeg(2),
        corners: randomNeg(2),
        edges: randomNeg(2),
        centre2: randomNeg(2),
        centre4: randomNeg(2),
        centre8: randomNeg(2),
        defended: randomNeg(2),
        attacks: randomNeg(2)
    }

}

/*function dbAccessHashTable(key: number, hashTable: HashTable): any {
	if (key in hashTable) {
		return hashTable[key];
	}
}

function dbAccessBloom(key: number, bloomFilter: BloomHashMapBoardStats): any {
	if (bloomFilter.has(key)) {
		return bloomFilter.get(key);
	}
}*/

function dbAccessHashTable(key: string, hashTable: HashTable): any {
	return (key in hashTable)
}

//function dbAccessBloom(key: number, bloomFilter: BloomHashMapBoardStats): any {
function dbAccessBloom(key: string, bloomFilter: BloomFilter): any {
	return (bloomFilter.has(key))
}

let s = performance.now();
for (let i = 0; i < 5000000; i++) {
	let x = getRandomBoardStats();
	hashTable[i] = x;
}
console.log("HashTable set time: " + (performance.now() - s));

/*s = performance.now();
for (let i = 0; i < 500000; i++) {
	let x = getRandomBoardStats();
	bloomFilter.put(i, x);
}
console.log("BloomFilter set time: " + (performance.now() - s));*/


function hashTableReadValid() {
	dbAccessHashTable('0', hashTable);
}

function hashTableReadInvalid() {
	dbAccessHashTable('999999999', hashTable);
}

function bloomFilterReadValid() {
	dbAccessBloom('0', bloomFilter);
}

function bloomFilterReadInvalid() {
	dbAccessBloom('999999999', bloomFilter);
}

function hashTableWrite() {
	hashTable['9999999991'] = randomStats;
}

function bloomFilterWrite() {
	bloomFilter.put('9999999991', randomStats);
}

function testHashTable() {
	for (let i = 0; i < 5000000; i++) {
		dbAccessHashTable(String(i), hashTable);
	}
}

function testBloomFilter() {
	for (let i = 0; i < 5000000; i++) {
		dbAccessBloom(String(i), bloomFilter);
	}
}

/*function testHashTableRandom() {
	//let i = Math.floor(Math.random() * 50000000);
	let i = 9999999999
	dbAccessHashTable(i, hashTable);
}

function testBloomFilterRandom() {
	//let i = Math.floor(Math.random() * 50000000);
	let i = 9999999999
	dbAccessBloom(i, bloomFilter);
}*/



//console.log(getBestNMembers(10, p.population))
//console.log(getBestNMembers2(10, p.population))

if (runConfig.bloomFilter) {
	//console.log("Running getBestNMembers")

	var suite = new Benchmark.Suite;

	suite
		/*.add('testHashTable', function() {
			testHashTable();
		})
		.add('testBloomFilter', function() {
			testBloomFilter();
		})
		.add('testHashTableRandom', function() {
			testHashTableRandom();
		})
		.add('testBloomFilterRandom', function() {
			testBloomFilterRandom();
		})*/
		.add('hashTableReadValid', function() {
			hashTableReadValid();
		})
		.add('hashTableReadInvalid', function() {
			hashTableReadInvalid();
		})
		.add('bloomFilterReadValid', function() {
			bloomFilterReadValid();
		})
		.add('bloomFilterReadInvalid', function() {
			bloomFilterReadInvalid();
		})
		.add('hashTableWrite', function() {
			hashTableWrite();
			delete hashTable[9999999991];
		})
		.add('bloomFilterWrite', function() {
			bloomFilterWrite();
		})
		.on('cycle', function(event: { target: any; }) {
			console.log(String(event.target));
		})

	testSuites.set('bloomFilter', suite);
	//suite.run({async: true});
} else {
	console.log("Skipping bloomFilter")
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


//testSuites.forEach((suite, name) => {
//	console.log("Running " + name)
//	suite.run({async: false});
//})

//for (let suite of testSuites) {
//	suite.run({async: true});
//}