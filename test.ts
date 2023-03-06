

var Benchmark = require('benchmark');

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

/*
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
*/

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
