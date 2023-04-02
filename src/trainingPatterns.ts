import { TrainingPatterns, WeightInit } from "./types";

export const STANDARD_TRAINING_PATTERNS: TrainingPatterns = {

    // custom patterns, define competition type each gen
    // many low depth high pop, RO competition, then many high depth low pop, RR competition
    'STP1': {
        999: {test: true, generations: 30, popWeightInit: WeightInit.RANDOM},//{generations: 10, competitionType: 1},
        0:  {depth:2, populationSize:200, competitionType: 1, matchCount: 8, test: true},
        //0:  {depth:2, populationSize:20, competitionType: 1, matchCount: 2, test: false},//
        1:  {depth:2, populationSize:150, competitionType: 1, matchCount: 10},
        2:  {depth:2, populationSize:150, competitionType: 1, matchCount: 15},
        3:  {depth:2, populationSize:150, competitionType: 1, matchCount: 15},
        4:  {depth:2, populationSize:150, competitionType: 1, matchCount: 15},
        5:  {depth:3, populationSize:150, competitionType: 1, matchCount: 15, test: true},
        6:  {depth:3, populationSize:150, competitionType: 1, matchCount: 15},
        7:  {depth:3, populationSize:100, competitionType: 1, matchCount: 15},
        8:  {depth:3, populationSize:100, competitionType: 1, matchCount: 15},
        9:  {depth:3, populationSize:100, competitionType: 1, matchCount: 15},
        10: {depth:3, populationSize:100, competitionType: 1, matchCount: 15, test: true},
        11: {depth:3, populationSize:75, competitionType: 1, matchCount: 20},
        12: {depth:3, populationSize:75, competitionType: 1, matchCount: 20},
        13: {depth:3, populationSize:75, competitionType: 1, matchCount: 20},
        14: {depth:3, populationSize:75, competitionType: 1, matchCount: 20},
        15: {depth:4, populationSize:75, competitionType: 1, matchCount: 20, test: true},
        16: {depth:4, populationSize:75, competitionType: 1, matchCount: 20},
        17: {depth:4, populationSize:75, competitionType: 1, matchCount: 20},
        18: {depth:4, populationSize:75, competitionType: 1, matchCount: 20},
        19: {depth:4, populationSize:75, competitionType: 1, matchCount: 20},
        20: {depth:5, populationSize:25, competitionType: 0, test: true},
        21: {depth:5, populationSize:25, competitionType: 0},
        22: {depth:5, populationSize:25, competitionType: 0},
        23: {depth:5, populationSize:25, competitionType: 0},
        24: {depth:5, populationSize:25, competitionType: 0},
        25: {depth:5, populationSize:25, competitionType: 0, test: true},
        26: {depth:6, populationSize:25, competitionType: 0},
        27: {depth:6, populationSize:25, competitionType: 0},
        28: {depth:6, populationSize:25, competitionType: 0, test: true},
        29: {depth:6, populationSize:25, competitionType: 0, test: true},
        30: {depth:7, populationSize:10, competitionType: 0, test: true},
    },

    'STP2': {
        999: {test: true, popWeightInit: WeightInit.RANDOM, generations: 40, learningRate: 0.15},//{generations: 10, competitionType: 1},
        0:  {depth:2, populationSize:500, competitionType: 1, matchCount: 8, test: true},
        //0:  {depth:2, populationSize:20, competitionType: 1, matchCount: 2, test: false},//
        1:  {depth:2, populationSize:200, competitionType: 1, matchCount: 10},
        2:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        3:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        4:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        5:  {depth:3, populationSize:150, competitionType: 1, matchCount: 20, test: true},
        6:  {depth:3, populationSize:150, competitionType: 1, matchCount: 20},
        7:  {depth:3, populationSize:150, competitionType: 1, matchCount: 20},
        8:  {depth:3, populationSize:150, competitionType: 1, matchCount: 20},
        9:  {depth:3, populationSize:150, competitionType: 1, matchCount: 20},
        10: {depth:3, populationSize:150, competitionType: 1, matchCount: 20, test: true},
        11: {depth:3, populationSize:100, competitionType: 1, matchCount: 20},
        12: {depth:3, populationSize:100, competitionType: 1, matchCount: 20},
        13: {depth:3, populationSize:100, competitionType: 1, matchCount: 20},
        14: {depth:3, populationSize:100, competitionType: 1, matchCount: 20},
        15: {depth:4, populationSize:100, competitionType: 1, matchCount: 20, test: true},
        16: {depth:4, populationSize:100, competitionType: 1, matchCount: 20},
        17: {depth:4, populationSize:100, competitionType: 1, matchCount: 20},
        18: {depth:4, populationSize:100, competitionType: 1, matchCount: 20},
        19: {depth:4, populationSize:100, competitionType: 1, matchCount: 20},
        20: {depth:5, populationSize:30, competitionType: 0, test: true},
        21: {depth:5, populationSize:30, competitionType: 0},
        22: {depth:5, populationSize:30, competitionType: 0},
        23: {depth:5, populationSize:30, competitionType: 0},
        24: {depth:5, populationSize:30, competitionType: 0},
        25: {depth:5, populationSize:30, competitionType: 0, test: true},
        26: {depth:6, populationSize:30, competitionType: 0},
        27: {depth:6, populationSize:30, competitionType: 0},
        28: {depth:6, populationSize:30, competitionType: 0, test: true},
        29: {depth:6, populationSize:30, competitionType: 0, test: true},
        30: {depth:7, populationSize:15, competitionType: 0, test: true},
    },

    'STP3': {
        999: {test: true, popWeightInit: WeightInit.RANDOM, generations: 40, learningRate: 0.075, randPercent: 5, keepTopPercent: 15},
        0:  {depth:2, populationSize:500, competitionType: 1, matchCount: 8, test: true},
        1:  {depth:2, populationSize:200, competitionType: 1, matchCount: 10},
        2:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        3:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        4:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        5:  {depth:3, populationSize:150, competitionType: 1, matchCount: 20, test: true},
        6:  {depth:3, populationSize:50, competitionType: 0},
        7:  {depth:3, populationSize:50, competitionType: 0},
        8:  {depth:3, populationSize:50, competitionType: 0},
        9:  {depth:3, populationSize:50, competitionType: 0},
        10: {depth:3, populationSize:50, competitionType: 0, test: true},
        11: {depth:3, populationSize:50, competitionType: 0},
        12: {depth:3, populationSize:50, competitionType: 0},
        13: {depth:3, populationSize:50, competitionType: 0},
        14: {depth:3, populationSize:50, competitionType: 0},
        15: {depth:4, populationSize:40, competitionType: 0, test: true},
        16: {depth:4, populationSize:40, competitionType: 0},
        17: {depth:4, populationSize:40, competitionType: 0},
        18: {depth:4, populationSize:40, competitionType: 0},
        19: {depth:4, populationSize:40, competitionType: 0},
        20: {depth:5, populationSize:30, competitionType: 0, test: true},
        21: {depth:5, populationSize:30, competitionType: 0},
        22: {depth:5, populationSize:30, competitionType: 0},
        23: {depth:5, populationSize:30, competitionType: 0},
        24: {depth:5, populationSize:30, competitionType: 0},
        25: {depth:5, populationSize:30, competitionType: 0, test: true},
        26: {depth:7, populationSize:20, competitionType: 0},
        27: {depth:7, populationSize:20, competitionType: 0},
        28: {depth:7, populationSize:20, competitionType: 0, test: true},
        29: {depth:7, populationSize:20, competitionType: 0, test: true},
        30: {depth:7, populationSize:20, competitionType: 0, test: true},
    },

    'STP4': {
        999: {test: true, popWeightInit: WeightInit.RANDOM, generations: 10, learningRate: 0.1, randPercent: 5, keepTopPercent: 15},
        0:  {depth:2, populationSize:400, competitionType: 1, matchCount: 8},
        1:  {depth:2, populationSize:200, competitionType: 1, matchCount: 10},
        2:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        3:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        4:  {depth:2, populationSize:200, competitionType: 1, matchCount: 15},
        5:  {depth:3, populationSize:150, competitionType: 1, matchCount: 20},
        6:  {depth:3, populationSize:50, competitionType: 0},
        7:  {depth:5, populationSize:30, competitionType: 0},
    },


    //Round Robin
    'RR': {
        999: {test: false, generations: 3},//{generations: 10, competitionType: 1},
        0:  {depth:2, populationSize:50}, //[2, 50], //2450 
        //0:  {depth:7, populationSize:10}, //[2, 50], //2450 
        1:  {depth:3, populationSize:40}, //[3, 40], //1560
        2:  {depth:4, populationSize:25}, //[4, 25], //870
        3:  {depth:4, populationSize:20}, //[4, 20], //380
        4:  {depth:4, populationSize:20}, //[4, 20],
        5:  {depth:5, populationSize:20}, //[5, 20],
        6:  {depth:5, populationSize:20}, //[5, 20],
        7:  {depth:5, populationSize:20}, //[5, 20],
        8:  {depth:6, populationSize:20}, //[6, 20],
        9:  {depth:6, populationSize:20}, //[6, 20],
        10: {depth:7, populationSize:20} //[7, 20]
    },
    'RR2': {
        0:  {depth:2, populationSize:50}, //[2, 50], //2450 
        //0:  {depth:7, populationSize:10}, //[2, 50], //2450 
        1:  {depth:2, populationSize:40}, //[3, 40], //1560
        2:  {depth:2, populationSize:25}, //[4, 25], //870
        3:  {depth:2, populationSize:20}, //[4, 20], //380
        4:  {depth:3, populationSize:20}, //[4, 20],
        5:  {depth:3, populationSize:20}, //[5, 20],
        6:  {depth:3, populationSize:20}, //[5, 20],
        7:  {depth:3, populationSize:20}, //[5, 20],
        8:  {depth:4, populationSize:20}, //[6, 20],
        9:  {depth:4, populationSize:20}, //[6, 20],
        10: {depth:5, populationSize:20} //[7, 20]
    },
    //Random Opponents
    'RO': {
        0:  {depth:2, populationSize:50, matchCount:15}, //[2, 200, 15], //3000
        1:  {depth:3, populationSize:40, matchCount:10}, //[3, 150, 10], //2000
        2:  {depth:4, populationSize:25, matchCount:10}, //[4, 100, 10], //1500
        3:  {depth:4, populationSize:20, matchCount:10}, //[4, 100, 10], //1500
        4:  {depth:4, populationSize:20, matchCount:10}, //[4, 100, 10], //1500
        5:  {depth:5, populationSize:20, matchCount:10}, //[5, 50, 10], //1000
        6:  {depth:5, populationSize:20, matchCount:10}, //[5, 50, 10],
        7:  {depth:5, populationSize:20, matchCount:10}, //[5, 50, 10],
        8:  {depth:6, populationSize:20, matchCount:10}, //[6, 50, 10],
        9:  {depth:6, populationSize:20, matchCount:10}, //[6, 50, 10],
        10: {depth:7, populationSize:20, matchCount:10}  //[7, 50, 10]
    },
    '_RR': {
        0:  {depth:2, populationSize:5}, //[2, 50], //2450 
        1:  {depth:3, populationSize:5}, //[3, 40], //1560
        2:  {depth:4, populationSize:5}, //[4, 25], //870
        3:  {depth:4, populationSize:5}, //[4, 20], //380
        4:  {depth:4, populationSize:5}, //[4, 20],
        5:  {depth:5, populationSize:5}, //[5, 20],
        6:  {depth:5, populationSize:5}, //[5, 20],
        7:  {depth:5, populationSize:5}, //[5, 20],
        8:  {depth:6, populationSize:5}, //[6, 20],
        9:  {depth:6, populationSize:5}, //[6, 20],
        10: {depth:7, populationSize:5} //[7, 20]
    },
}