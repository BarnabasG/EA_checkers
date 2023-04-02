

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
var Benchmark = require('benchmark');
import { generateKey, generateKeyComplete, getWeights, pad } from "./src/helper";
import { BoardStats, WeightInit } from "./src/types";
import { CheckersGame } from "./src/checkers";

var checkers = new CheckersGame()


function colourKey1() {
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
}

function completeKey1() {
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
}




var suite = new Benchmark.Suite;
//const boardStats = getWeights(WeightInit.RANDOM)

suite.add('colourKey1', function() {
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
	})
	.on('cycle', function(event: { target: any; }) {
		console.log(String(event.target));
	})
	//.on('complete', function() {
	//	console.log('Fastest is ' + this.filter('fastest').map('name'));
	//})
	//.run({async: true});



export function reverseBits1(num: number): number {
	let result = 0;
	for (let i = 0; i < 32; i++) {
		result = (result << 1) | (num & 1);
		num >>>= 1;
	}
	return result << 16 | result >>> 16;
}

export function reverseBits(x: number) {
	x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
	x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
	x = ((x >> 4) & 0x0F0F0F0F) | ((x & 0x0F0F0F0F) << 4);
	x = ((x >> 8) & 0x00FF00FF) | ((x & 0x00FF00FF) << 8);
	x = (x >>> 16) | (x << 16);

	return x >>> 0;
}

//let x = reverseBits(0b00000000000000000000000011110000)
//console.log(pad(x.toString(2)))

var suite = new Benchmark.Suite;
//const boardStats = getWeights(WeightInit.RANDOM)

suite.add('reverseBits', function() {
		reverseBits(0b00000000000000000000000011110000);
	})
	.on('cycle', function(event: { target: any; }) {
		console.log(String(event.target));
	})
	//.on('complete', function() {
	//	console.log('Fastest is ' + this.filter('fastest').map('name'));
	//})
	.run({async: true});