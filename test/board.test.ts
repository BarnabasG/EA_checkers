import { describe, expect, test } from '@jest/globals';
import { Board } from '../src/board';

describe('Board', () => {
    test('create board', () => {
        var board = new Board();
        expect(board).toBeDefined();
        expect(board).toBeInstanceOf(Board);
        expect(board.white).toBe(0b0000_0000_0000_0000_0000_1111_1111_1111);
        expect(board.black).toBe(0b1111_1111_1111_0000_0000_0000_0000_0000);
        expect(board.king).toBe(0b0000_0000_0000_0000_0000_0000_0000_0000);
    });
});

describe('getMovablePiecesWhite', () => {
    test('get moveable pieces white', () => {
        var board = new Board();
        expect(board.getMovablePiecesWhite()).toBe(0b0000_0000_0000_0000_0000_1111_0000_0000);
    });
});

describe('getMovablePiecesBlack', () => {
    test('get moveable pieces black', () => {
        var board = new Board();
        expect(board.getMovablePiecesBlack()).toBe(0b0000_0000_1111_0000_0000_0000_0000_0000);
    });
});

describe('getCapturePiecesWhite', () => {
    test('get capture pieces white - no captures', () => {
        var board = new Board();
        expect(board.getCapturePiecesWhite()).toBe(0b0000_0000_0000_0000_0000_0000_0000_0000);
    });
});

describe('getCapturePiecesBlack', () => {
    test('get capture pieces black - no captures', () => {
        var board = new Board();
        expect(board.getCapturePiecesBlack()).toBe(0b0000_0000_0000_0000_0000_0000_0000_0000);
    });
});

