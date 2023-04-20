import { describe, expect, test } from '@jest/globals';
import { areListsEqual, checkDraw, decToBin, generateInitialPopulation, generateKey, generateKeyComplete, getAvrDist, getBoardFomBin, getPieceCount, getPopulationMatches, getPresentBitIndexes, getPresentBits, getWeights, loadPopFromJSON, pad, permutations, roundTo } from '../src/helper';
import { Status, WeightInit, WeightSet } from '../src/types';


describe('decToBin', () => {
    test('should convert 63 to 111111', () => {
        expect(decToBin(63)).toBe('111111');
    });
});

describe('pad', () => {
    test('should convert 123456789 to 0000000000000123456789', () => {
        expect(pad('123456789')).toBe('00000000000000000000000123456789');
    });
});

describe('pad, width=12', () => {
    test('should convert 123456789 to 0123456789', () => {
        expect(pad('123456789', 12)).toBe('000123456789');
    });
});

describe('pad, width=10, z=1', () => {
    test('should convert 123456789 to 0123456789', () => {
        expect(pad('123456789', 12, 'x')).toBe('xxx123456789');
    });
});

describe('getPresentBits', () => {
    test('should return [1, 4, 16, 16777216, 67108864, 268435456, 1073741824] as present bits for binary value', () => {
        expect(getPresentBits(0b11010101000000000000000000010101)).toStrictEqual([1, 4, 16, 16777216, 67108864, 268435456, 1073741824, -2147483648]);
    });
});

describe('getPresentBitIndexes', () => {
    test('should return [0, 2, 4, 24, 26, 28, 30, 31] as present bit indexes for binary value', () => {
        expect(getPresentBitIndexes(0b11010101000000000000000000010101)).toStrictEqual([0, 2, 4, 24, 26, 28, 30, 31]);
    });
});

describe('getBoardFomBin', () => {
    test('should convert 01010101000000000000001111111111 to correct board', () => {
        expect(getBoardFomBin('01010101000000000000001111111111'))
        .toStrictEqual(["- 0 - 1 - 0 - 1",
                        "0 - 1 - 0 - 1 -",
                        "- 0 - 0 - 0 - 0",
                        "0 - 0 - 0 - 0 -",
                        "- 0 - 0 - 0 - 0",
                        "0 - 0 - 1 - 1 -",
                        "- 1 - 1 - 1 - 1",
                        "1 - 1 - 1 - 1 -"]);
    });
});

describe('getPieceCount', () => {
    test('should convert 01010101000000000000001111111111 to 14', () => {
        expect(getPieceCount(0b01010101000000000000001111111111)).toBe(14);
    });
});

describe('getAvrDist', () => {
    test('should convert 00000000000000000000000011111111 to 0.5', () => {
        expect(getAvrDist(0b00000000000000000000000011111111)).toBe(0.5);
    });
});

describe('roundTo', () => {
    test('should convert 15.91 to 16', () => {
        expect(roundTo(15.91)).toBe(16);
    });
});

describe('roundTo', () => {
    test('should convert 15.91 to 15.9', () => {
        expect(roundTo(15.91, 1)).toBe(15.9);
    });
});

describe('getWeights', () => {
    test('should return zeroes weights', () => {
        expect(getWeights(WeightInit.ZERO))
        .toStrictEqual({
            pieces: 0,
            kings: 0,
            avrDist: 0,
            backline: 0,
            corners: 0,
            edges: 0,
            centre2: 0,
            centre4: 0,
            centre8: 0,
            defended: 0,
            attacks: 0
        });
    });
});

describe('getWeights', () => {
    test('should return ones weights', () => {
        expect(getWeights(WeightInit.ONE))
        .toStrictEqual({
            pieces: 1,
            kings: 1,
            avrDist: 1,
            backline: 1,
            corners: 1,
            edges: 1,
            centre2: 1,
            centre4: 1,
            centre8: 1,
            defended: 1,
            attacks: 1
        });
    });
});

describe('getWeights', () => {
    test('should return capture prefer weights', () => {
        expect(getWeights(WeightInit.CAPTURE_PREFER))
        .toStrictEqual({
            pieces: 1,
            kings: 1,
            avrDist: 0,
            backline: 0,
            corners: 0,
            edges: 0,
            centre2: 0,
            centre4: 0,
            centre8: 0,
            defended: 0,
            attacks: 0
        });
    });
});

describe('generateKeyComplete', () => {
    test('should return key for board', () => {
        expect(generateKeyComplete(
            0b00000000000000000000000011111111,
            0b11111111100000000000000011111111,
            0b01110000000000000000000000000111))
        .toBe('255/4286578943/1879048199');
    });
});

describe('generateKey', () => {
    test('should return key for board value (one colour)', () => {
        expect(generateKey(
            0b00000000000000000000000011111111,
            0b00000000000000000000000011110000))
        .toBe('255/240');
    });
});

describe('getAvrDist', () => {
    test('should convert 00000000000000000000000011111111 to 0.5', () => {
        expect(getAvrDist(0b00000000000000000000000011111111)).toBe(0.5);
    });
});

describe('permutations', () => {
    test('should get all permutation pairs of [0,1,2]', () => {
        expect(permutations([0,1,2],2))
        .toStrictEqual([[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]);
    });
});

describe('getPopulationMatches', () => {
    test('should get set of matches for population competition 0', () => {
        expect(getPopulationMatches(3, 0))
        .toStrictEqual([[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]);
    });
});

describe('getPopulationMatches', () => {
    test('should get set of matches for population competition 1, 2 matches per bot', () => {
        expect(getPopulationMatches(4, 1, 2))
        .toHaveLength(8);
    });
});

describe('getPopulationMatches', () => {
    test('should get set of matches for population competition 1, 2 matches per bot, odd number of bots', () => {
        expect(getPopulationMatches(5, 1, 2))
        .toHaveLength(12);
    });
});

describe('checkDraw', () => {
    test('return no draw for board with less than 40 non man moves', () => {
        expect(checkDraw(
            [],
            39
        ))
        .toBe(Status.PLAYING);
    });
});

describe('checkDraw', () => {
    test('return draw by 40 move rule for board with greater than 40 non man moves', () => {
        expect(checkDraw(
            [],
            41
        ))
        .toBe(Status.DRAW_40);
    });
});

describe('checkDraw', () => {
    test('return draw by repetion for repeated moves', () => {
        expect(checkDraw(
            [[1,2,0],[3,2,0],[1,2,0],[3,2,0],[1,2,0]],
            39
        ))
        .toBe(Status.DRAW_REPETITION);
    });
});

describe('checkDraw', () => {
    test('return no draw where moves are different', () => {
        expect(checkDraw(
            [[1,2,0],[3,2,0],[5,2,0],[3,2,0],[1,2,0]],
            39
        ))
        .toBe(Status.PLAYING);
    });
});

describe('areListsEqual', () => {
    test('return false', () => {
        expect(areListsEqual([1,2,0],[3,2,0],[1,2,0])).toBe(false);
    });
});

describe('areListsEqual', () => {
    test('return true', () => {
        expect(areListsEqual([1,2,0],[1,2,0],[1,2,0])).toBe(true);
    });
});

describe('generateInitialPopulation', () => {
    test('return population map', () => {
        expect(generateInitialPopulation(2, WeightInit.ZERO))
        .toStrictEqual(
            new Map<number, WeightSet>([
                [0, {"evaluationDB": {}, 
                    "score": 0, 
                    "weights": 
                        {"attacks": 0, 
                        "avrDist": 0, 
                        "backline": 0, 
                        "centre2": 0, 
                        "centre4": 0, 
                        "centre8": 0, 
                        "corners": 0, 
                        "defended": 0, 
                        "edges": 0, 
                        "kings": 0, 
                        "pieces": 0}
                    }
                ],
                [1, 
                    {"evaluationDB": {}, 
                    "score": 0, 
                    "weights": 
                        {"attacks": 0, 
                        "avrDist": 0, 
                        "backline": 0, 
                        "centre2": 0, 
                        "centre4": 0, 
                        "centre8": 0, 
                        "corners": 0, 
                        "defended": 0, 
                        "edges": 0, 
                        "kings": 0, 
                        "pieces": 0}
                    }
                ],
                ])
        );
    });
});

/*describe('getRandomSample', () => {
    test('return random samle', () => {
        expect(getRandomSample([0,1,2,3,4,5], 3))
        .toHaveLength(3);
    });
});*/






