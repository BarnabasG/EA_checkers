

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

var Benchmark = require('benchmark');
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