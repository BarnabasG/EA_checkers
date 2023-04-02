import { describe, expect, test } from '@jest/globals';
import { Checkers } from '../src/run';
import { WeightInit, WeightSet } from '../src/types';


describe('compete', () => {
    test('return 5 for draw by movelimit', () => {
        let c = new Checkers();
        c.setPopulation({populationSize: 2, weightInit: WeightInit.ZERO});
        c.setMoveLimit(10);
        expect(c.compete([0,1])).toBe(5);
    });
});


describe('loadPopFromJSON', () => {
    test('return correct population from json file (evaluation DB excluded)', async () => {
        let c = new Checkers();
        try {
            let r = await c.getPopulationFromJSONFile('../test/population.test.json');
            expect(r)
            .toStrictEqual(
                new Map<number, WeightSet>([
                    [0, {"evaluationDB": {},
                        "score": 0, 
                        "weights": 
                            {"attacks": 1, 
                            "avrDist": 1, 
                            "backline": 1, 
                            "centre2": 1, 
                            "centre4": 1, 
                            "centre8": 1, 
                            "corners": 1, 
                            "defended": 1, 
                            "edges": 1, 
                            "kings": 1, 
                            "pieces": 10}
                        }
                    ],
                    [1, 
                        {"evaluationDB": {},
                        "score": 0, 
                        "weights": 
                            {"attacks": 1, 
                            "avrDist": 1, 
                            "backline": 1, 
                            "centre2": 1, 
                            "centre4": 1, 
                            "centre8": 1, 
                            "corners": 1, 
                            "defended": 1, 
                            "edges": 1, 
                            "kings": 10, 
                            "pieces": 1}
                        }
                    ],
                    [2, 
                        {"evaluationDB": {},
                        "score": 0, 
                        "weights": 
                            {"attacks": 1, 
                            "avrDist": 10, 
                            "backline": 1, 
                            "centre2": 1, 
                            "centre4": 1, 
                            "centre8": 1, 
                            "corners": 1, 
                            "defended": 1, 
                            "edges": 1, 
                            "kings": 1, 
                            "pieces": 1}
                        }
                    ],
                    [3, 
                        {"evaluationDB": {},
                        "score": 0, 
                        "weights": 
                            {"attacks": 1, 
                            "avrDist": 1, 
                            "backline": 10, 
                            "centre2": 1, 
                            "centre4": 1, 
                            "centre8": 1, 
                            "corners": 1, 
                            "defended": 1, 
                            "edges": 1, 
                            "kings": 1, 
                            "pieces": 1}
                        }
                    ],
                    ])
            );
        } catch (e) {
            throw e;
        }
    });
});