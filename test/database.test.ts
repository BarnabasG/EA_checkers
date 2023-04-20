import { describe, expect, test } from '@jest/globals';
import { BloomDatabase, HashMap } from '../src/database';

describe('BloomDatabase', () => {
    test('create BloomDatabase object', () => {
        var bloomDB = new BloomDatabase();
        expect(bloomDB).toBeDefined();
        expect(bloomDB).toBeInstanceOf(BloomDatabase);
        expect(bloomDB.getSize()).toBe(0);
    });
});

describe('HashMap', () => {
    test('create HashMap object', () => {
        var hashMap = new HashMap();
        expect(hashMap).toBeDefined();
        expect(hashMap).toBeInstanceOf(HashMap);
        expect(hashMap.getSize()).toBe(0);
    });
});