import { describe, expect, test } from '@jest/globals';
import { WeightInit } from '../src/types';
import { evaluateBoard } from '../src/ai';
import { generateBin, getWeights, printBoard } from '../src/helper';
import { CheckersGame } from '../src/checkers';
import { HashMap } from '../src/database';


describe('evaluateBoard', () => {
    test('return evaluation 0 for initial position with 0 weights', () => {
        let c = new CheckersGame();
        console.log(c.board.getBoardStats(new HashMap()))
        let weights = getWeights(WeightInit.ZERO);
        expect(evaluateBoard(c, weights)).toBe(0);
    });
});

describe('evaluateBoard', () => {
    test('return evaluation 0 for initial position with 1 weights', () => {
        let c = new CheckersGame();
        let weights = getWeights(WeightInit.ONE);
        expect(evaluateBoard(c, weights)).toBe(0);
    });
});

describe('evaluateBoard', () => {
    test('return evaluation 0 for initial position with 1 weights', () => {
        let c = new CheckersGame();
        const BIN = generateBin()
        c = c.makeMove({start: BIN[8], end: BIN[13], captures: 0});
        printBoard(c.board.white, c.board.black, c.board.king)
        let weights = getWeights(WeightInit.ONE);
        expect(evaluateBoard(c, weights)).toBe(0.30309523809523814);
    });
});