import { minimax, evaluateBoard, naiveMinimax } from "./ai";
import { CheckersGame } from "./checkers";
import { BoardStats, GenerationParams, Move, Pattern, Player, PopStats, PopulationParams, Result, Status, TestResults, TestScore, TrainingParams, WeightInit, WeightSet } from "./types";
import { getPopulationMatches, printBoard, generateKey, checkDraw, writeToFile, loadPopFromJSON, generateResultsTable, permutations, generateInitialPopulation, roundTo, getStandardDeviation, getPieceCount, getTime } from "./helper";
//import { getPopulationMatches, printBoard, boardStatsDatabase, generateKey, checkDraw, writeToFile, loadPopFromJSON, generateResultsTable, permutations, generateInitialPopulation, roundTo, getStandardDeviation, getPieceCount, getTime } from "./helper";
import { Population } from "./population";
import { STANDARD_TRAINING_PATTERNS } from "./trainingPatterns";
import { HashMap, generateDatabase } from './database';



/*import boardDB from '../boardDB.json';
console.log('Reading board database json')
let s = performance.now();
export var boardStatsDatabase: BoardDatabase = boardDB;
console.log('Board database json read', performance.now() - s, 'ms')
console.log('saved layouts', Object.keys(boardStatsDatabase).length);*/



//Will look at draft if sent before friday 24th March /////////
// add para on what else you will cover and what you want feedback on

const DRAW_SCORE = 0.38;

export class Checkers {

    private population!: Population;
    private moveLimit: number;
    private depth: number;
    public bestWeights!: BoardStats;
    private testDepth: number;
    private guidedWinners: BoardStats[];
    public boardStatsDatabase: HashMap;
    //readonly matches: number[][];
    
    //readonly populationSize: number;

    //private moveLimit: number;
    //private depth: number;

    constructor(
        //population: Population = new Population(populationSize),
        //matches: number[][] = getPopulationMatches(populationSize)
        //populationSize: number = 10
    ) {
        //this.populationSize = populationSize;
        //this.population = new Population(populationSize);
        //this.matches = getPopulationMatches(populationSize);
        //this.population.randomiseWeights();
        this.moveLimit = 300;
        this.guidedWinners = [];
        this.testDepth = 5;
        this.depth = 5;
        this.boardStatsDatabase = new HashMap();
    }



    //train(depth: number = this.depth, moveLimit: number = this.moveLimit) {
    train(trainingParams: TrainingParams) {

        if (trainingParams == undefined) {
            trainingParams = {
                trainingMethod: 'STP1',
                startGeneration: 0,
                generations: 5
            }
        }


        //if (trainingParams.standard) {
            //let method = trainingParams.trainingMethod || 'RR'; 
            //this.standardTraining(method, trainingParams.generations);
            //this.standardTraining(trainingParams);
        this.standardTraining(trainingParams.trainingMethod!);
        //} else {
        //    this.customTraining(trainingParams);
        //}


        //this.moveLimit = trainingParams.moveLimit;
        //this.depth = trainingParams.depth;

        //const population = new Population(populationSize);
        //population.randomiseWeights();
        //console.log(this.population.population)
        //const matches = getPopulationMatches(populationSize);
        //let results: number[] = []; 

        /*this.population = new Population(populationSize);
        this.matches = getPopulationMatches(populationSize);
        this.population.randomiseWeights();
        this.moveLimit = moveLimit;
        this.depth = depth;*

        //console.log(matches)

        //const Pool = require('multiprocessing').Pool;
        //const pool = new Pool(4);
        //pool.map([this.matches], this.foo, {onResult: val => { results.push(val) }})

        //console.log(results)

        //let results: number[][] = [];
        //SingletonPool.setMaxProcesses(4);

        //const pool = SingletonPool.getInstance();

        //let promises = []
        //for (const match of matches) {
            //pool.exec(compete, [population.population[match[0]]['weights'], population.population[match[1]]['weights'], moveLimit, depth])
            //    .then((result: number) => {
            //        results.push([result])
            //    })
            //promises.push(pool.addJob(compete, population.population[match[0]]['weights'], population.population[match[1]]['weights'], moveLimit, depth))
        //}

        //const promisesResults = await Promise.all(promises);
        //promisesResults.forEach(result => console.log(result));


        /*for (let i = 0; i < this.matches.length; i++) {
            console.log(`match ${i+1}/${this.matches.length}`)
            let index1 = this.matches[i][0];
            let index2 = this.matches[i][1];
            //let status = compete(this.population.population[index1]['weights'], this.population.population[index2]['weights'], moveLimit, depth);
            let status = this.compete([index1, index2]);
            if (status === 1) {
                this.population.population[index1]['score'] += 1;
                console.log('white won', index1, index2)
            } else if (status === 2) {
                this.population.population[index2]['score'] += 1;
                console.log('black won', index1, index2)
            } else if (status === 0) {
                this.population.population[index1]['score'] += DRAW_SCORE;
                this.population.population[index2]['score'] += DRAW_SCORE;
                console.log('draw', index1, index2)
            }
        }*/
        
        //for (let i = 0; i < this.population.size; i++) {
        //    console.log(i, this.population.population[i]['score'])
        //}/**/

        //console.log(this.population.getScores())
        
    }

    compete(indexes: number[]): number {


        let checkers = new CheckersGame();
        let status = 0;
        let moveIndex = 0;


        let boardStack: number[][] = [];
        let nonManMoves: number = 0;


        while (moveIndex < this.moveLimit) {
            let moves = checkers.getMoves();
            status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
            if (status !== 0) {
                return status;
            }
            let move = minimax(checkers, this.depth, this.population.population, checkers.player === Player.WHITE ? indexes[0] : indexes[1], this.boardStatsDatabase);
            checkers = checkers.makeMove(move);

            (move.end & checkers.board.king) && !move.captures ? nonManMoves++ : nonManMoves = 0;
            boardStack.push([checkers.board.white, checkers.board.black, checkers.board.king]);
            if (boardStack.length > 10) boardStack.shift();

            //console.log("here2")

            let s = checkDraw(boardStack, nonManMoves)
            if (s !== Status.PLAYING) {
                //console.log(Status[s])
                //printBoard(checkers.board.white, checkers.board.black, checkers.board.king)
                return s;
            }

            //console.log("here3")
            
            
            //console.log('move', moveIndex, checkers.player === Player.WHITE ? 'black' : 'white')
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);

            //console.log(move)
            //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
            //console.log('white eval', evaluateBoard(checkers, whiteWeights))
            //console.log('black eval', evaluateBoard(checkers, blackWeights))
            moveIndex++;
            //console.log(move, moveIndex, checkers.board)
        }
        return Status.DRAW_MOVELIMIT;
        //}, 100000);//2000*this.depth);
        //console.log('timeout')
        //console.log(this, indexes)
        //return 0;
    
        //console.log('draw', moveIndex);
        //printBoard(checkers.board.white, checkers.board.black, checkers.board.king);
        
    }

    setDepth(depth: number) {
        this.depth = depth;
    }

    setPopulation(populationParams: PopulationParams) {
        this.population = new Population(populationParams);
    }

    setMoveLimit(moveLimit: number) {
        this.moveLimit = moveLimit;
    }

    standardTraining(method: string, startGen: number = 0, initPop?: Map<number, WeightSet>, logfile?: string) {

        if (!(method in STANDARD_TRAINING_PATTERNS)) {
            console.error('Invalid standard method');
            return;
        }

        writeToFile('testScores_log.txt', method);


        //const pattern: Pattern = STANDARD_TRAINING_PATTERNS[method];

        const pattern: Pattern = STANDARD_TRAINING_PATTERNS[method];

        const maxDefGen = Math.max(...Object.getOwnPropertyNames(pattern).map(Number).filter(n => n !== 999));

        var defaultValues: TrainingParams = {
            //trainingMethod: 'RR',
            startGeneration: startGen,
            depth: undefined,
            moveLimit: 250,
            generations: maxDefGen,
            populationSize: undefined,
            competitionType: 0,     
            test: true,
            testDepth: 5,
            //populationSizePattern: undefined,
            popWeightInit: WeightInit.RANDOM,
            matchCount: undefined,
            generationParams: {
                selectionMethod: 0,
                learningRate: undefined,
                selectionPercent: undefined,
                keepTopPercent: undefined,
                randPercent: undefined,
                tournamentSize: undefined,
                rankBias: undefined,
            }
        };

        

        //config values
        if (999 in pattern) defaultValues = this.getParams(defaultValues, pattern[999]);

        let params: TrainingParams;
        let popParams: PopulationParams;

        params = this.getParams(defaultValues, pattern[Math.min(maxDefGen, defaultValues.startGeneration!)]);
        
        let popOverride: boolean = false;
        if (initPop) {
            popParams = {
                population: initPop
            }
            popOverride = true;
        } else {
            popParams = {
                populationSize: params.populationSize,
                weightInit: params.popWeightInit,
            }
        }
        this.setPopulation(popParams!);
        console.log(params)
        //console.log(this.population.population)


        let matches: number[][];
        //this.moveLimit = params.moveLimit;
        //this.moveLimit = trainingParams.moveLimit;
        this.moveLimit = params.moveLimit!;
        this.testDepth = params.testDepth!;
        //let moveLimit: number;
        //let depth: number;
        //let population: Population;

        //let testScores: TestScore[] = [];
        let testScores: TestResults[] = [];
        let winners: BoardStats[] = [];

        //this.population = new Population(params[standardStartGeneration].populationSize);
        //this.population = new Population(pattern[standardStartGeneration].populationSize);


        //let popParams: PopulationParams = {
        //    populationSize: params.populationSize,
        //    weightInit: params.popWeightInit,
            //population: generateInitialPopulation()
        //}

        //this.population = new Population(params.populationSize);
        //this.population = new Population(popParams);
        

        //const trainingInstance = 'generation_log/log_'.concat(new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-'), '.json');
        var trainingInstance: string;
        let logtime = new Date().toLocaleString().replace(/:/g, '-').replace(/\//g, '-').replace(/ /g, '_').replace(/,/g, '');
        if (logfile) {
            trainingInstance = `generation_log/${logfile}_CONTINUED_${logtime}.txt`;
            writeToFile(trainingInstance, `\n\n//CONTINUING TRAINING - ${logfile}//\n`);
            writeToFile('testScores_log.txt', '//CONTINUING TRAINING//'+logfile);
        } else {
            trainingInstance = `generation_log/log_${logtime}.txt`;
        }

        //const maxDefGen = pattern.k
        
        //writeToFile('testScores_log.txt', JSON.stringify(trainingParams));

        //let params: TrainingParams; //= this.getParams(defaultValues, pattern[0]);

        //console.log(Math.max(...Object.getOwnPropertyNames(pattern).map(Number).filter(n => n !== 999)));
        //const maxDefGen = Math.max(...Object.getOwnPropertyNames(pattern).map(Number).filter(n => n !== 999));


        for (let gen=params.startGeneration!; gen<params.generations!; gen++) {
            
            console.log(`generation ${gen}/${params.generations!-1}`)
            params = this.getParams(defaultValues, pattern[Math.min(maxDefGen, gen)]);
            //this.population = new Population(pattern[gen].populationSize);
            if (popOverride) {
                params.populationSize = this.population.size;
                popOverride = false;
            }

            console.log(gen, params)

            //this.depth = pattern[Math.min(10, gen+1)].depth;
            this.depth = params.depth!;

            //this.population.randomiseWeights();

            //console.log(params)

            //const now = new Date();
            //const hours = now.getHours().toString().padStart(2, '0');
            //const minutes = now.getMinutes().toString().padStart(2, '0');
            //const seconds = now.getSeconds().toString().padStart(2, '0');
            //const time = `${hours}_${minutes}_${seconds}: `;
            const time = getTime()
            writeToFile('testScores_log.txt', time.concat(" ",gen.toString(),": "));
            writeToFile('testScores_log.txt', JSON.stringify(params));


            matches = getPopulationMatches(params.populationSize!, params.competitionType, params.matchCount);

            //this.moveLimit = trainingParams.moveLimit;
            let value: WeightSet;
            let index: number;

            let genStart = performance.now();
            
            console.log("Starting matches")
            for (let j = 0; j < matches.length; j++) {
                //if (j%10 == 0 && this.depth > 5) console.log(`match ${j}/${matches.length}`)
                if (j%10 == 0) console.log(`Generation ${gen}: match ${j}/${matches.length}`)
                //console.log(`match ${j}/${matches.length}`)
                let index1 = matches[j][0];
                let index2 = matches[j][1];
                //console.log(index1, index2)
                let status = this.compete([index1, index2]);
                //setTimeout(() => {
                //let status = await this.compete([index1, index2]);
                /*let status: number;
                this.compete([index1, index2]).then((result) => {
                    status = result;
                }).catch((err) => {
                    status = 0;
                    console.error(err);
                });*/
                if (status > 2) {
                    value = this.population.population.get(index1)!;
                    value['score'] += DRAW_SCORE;
                    this.population.population.set(index1, value);
                    value = this.population.population.get(index2)!;
                    value['score'] += DRAW_SCORE;
                    this.population.population.set(index2, value);
                    //console.log('draw', index1, index2)
                } else {
                    index = status === 1 ? index1 : index2;
                    value = this.population.population.get(index)!;
                    value['score'] += 1;
                    this.population.population.set(index, value);
                }
                //this.population.population.set(index, value);
            }
            console.log(this.population.getScores())
            winners.push(this.population.getBestWeights());

            let analysis = this.getParamAlanysis()

            writeToFile('testScores_log.txt', JSON.stringify(analysis));

            let testScore: TestResults;
            if (params.test) {
                let testStart = performance.now();
                testScore = this.testPopulation();
                let testTime = performance.now() - testStart;
                testScore['testTime'] = testTime;
                console.log(testScore)
                console.log('test time', testTime);
                testScores.push(testScore);
                writeToFile('testScores_log.txt', JSON.stringify(testScore));
            } else {
                console.log("no test")
                //testScore = {testTime: 0, testScore: 0, testDraws: 0, testWins: 0, testLosses: 0};
            }


            let popData = this.getPopulationMap();
            if (params.test) popData.set('testScore', testScore!);
            popData.set('generation', gen);
            let genTime = performance.now() - genStart;
            popData.set('generation time', genTime);
            const savePop = Object.fromEntries(popData);
            //console.log('popdata',savePop)
            writeToFile(trainingInstance, JSON.stringify(savePop));
            console.log(`${genTime}ms`)
            //writeToFile(trainingInstance, `generation time: ${genTime}ms`);
            //TODO: get max defined generation rather than hard code 10
            //console.log('next generation id', Math.min(10, gen+1))
            console.log('saved evals', this.population.population.get(0)!.evaluationDB.length, this.population.population.get(1)!.evaluationDB.size, this.population.population.get(2)!.evaluationDB.size) 
            let patternIndex = Math.min(maxDefGen, gen+1);
            //if  (pattern[patternIndex].generationParams !== undefined) {
            //let genParams: GenerationParams | undefined = pattern[patternIndex].generationParams;
            //}
            if (gen+1 < params.generations!) this.population.nextGeneration(pattern[patternIndex].populationSize, params.generationParams);
            //{
            //    size: pattern[patternIndex].populationSize,
            //    selectionPercent: pattern[patternIndex].generationParams!.selectionPercent,
            //    keepTopPercent: pattern[patternIndex].generationParams!.keepTopPercent,
            //    selectionMethod: pattern[patternIndex].generationParams!.selectionMethod,
            //    learningRate: pattern[patternIndex].generationParams!.learningRate,
            //    randPercent: pattern[patternIndex].generationParams!.randPercent,
            //    tournamentSize: pattern[patternIndex].generationParams!.tournamentSize,
            //});
            //console.log(population.getScores())

        }
        console.log("generations complete")
        //console.log(testScores)
        /*this.population.nextGeneration({ size: 100 });
        let testStart = performance.now();
        let scores = this.testPopulation(true);
        let testTime = performance.now() - testStart;
        scores['testTime'] = testTime;
        console.log(scores)
        console.log('test time', testTime);
        testScores.push(scores);

        let popData = this.getPopulationMap();
        popData.set('testScore', scores);
        popData.set('generation', 'final');
        const savePop = Object.fromEntries(popData);
        //console.log('popdata',savePop)
        writeToFile(trainingInstance, JSON.stringify(savePop));
        winners.push(this.population.getBestWeights());*/

        console.log(testScores)


        this.bestWeights = this.testWinners(winners);

        console.log('best weights', this.bestWeights)
        
        console.log("generations saved to", trainingInstance)

        return this.bestWeights;
        
    }

    getParams(main: object, override: object): object {
        let mergedParams = Object.assign({}, main);
        for (const key in main) {
            if (override.hasOwnProperty(key)) {
                if (typeof (main as any)[key] === 'object' && typeof (override as any)[key] === 'object') {
                    (mergedParams as any)[key] = this.getParams((main as any)[key], (override as any)[key]);
                } else {
                    (mergedParams as any)[key] = (override as any)[key];
                }
            } else {
                (mergedParams as any)[key] = (main as any)[key];
            }
            //override.hasOwnProperty(key) ? (mergedParams as any)[key] = (override as any)[key]: (mergedParams as any)[key] = (main as any)[key];
        };
        return mergedParams;
    }

    getPopulationMap(): Map<string, any> {
        let popData = new Map<string, any>();
        popData.set('population', new Map<number, WeightSet>());
        // iterate over the original map and set the value of evaluationDB to an empty object for each WeightSet object
        for (let [key, weightSet] of this.population.population.entries()) {
            popData.get('population')!.set(key, { ...weightSet, evaluationDB: {} });
        }
        popData.set('population', Object.fromEntries(popData.get('population')!.entries()))
        //const savePop = Object.fromEntries(popData);
        //writeToFile(trainingInstance, JSON.stringify(savePop));
        return popData//savePop//JSON.stringify(savePop)
    }


    getParamAlanysis() {

        let count = Math.min(Math.max(Math.min(15, this.population.size), this.population.size * 0.5), 50);
        console.log(`reducing population to ${count} for param analysis (from ${this.population.size})`)
        const newpop = this.population.getBestNMembers(count);

        //let paramAnalysis = new Map<string, any>();

        const stats: PopStats = {};

        const properties: { [key: string]: number[] } = {};


        newpop.forEach((key) => {
            const weights = this.population.population.get(key)!.weights;
            for (const prop in weights) {
                if (!properties[prop]) properties[prop] = [];
                properties[prop].push(weights[prop]);
            }
        });

        console.log('properties', properties)

        for (const prop in properties) {
            let m = properties[prop].reduce((a, b) => a + b) / properties[prop].length
            let sd = getStandardDeviation(properties[prop]);
            stats[prop] = {
                sum: roundTo(properties[prop].reduce((a, b) => a + b), 4),
                min: roundTo(Math.min(...properties[prop]), 4),
                max: roundTo(Math.max(...properties[prop]), 4),
                mean: roundTo(m, 4),
                stdDev: roundTo(sd, 4),
                lowerBound: roundTo(m-sd, 4),
                upperBound: roundTo(m+sd, 4)
            }
        }

        console.log('stats', stats)

        return stats;

    }

        

    /*customTraining(trainingParams: TrainingParams) {
        const { depth = 5,
            moveLimit = 150,
            generations = 10,
            populationSize = 50,
            competitionType = 0,
            selectionMethod = 0,
            learningRate = undefined,
            selectionPercent = undefined,
            keepTopPercent = undefined,
            populationSizePattern = undefined } = trainingParams;

        this.population = new Population(populationSize);
    }*/

    testPopulation(testAll: boolean = false, writeWinners: boolean = true): TestResults { //{resultsNaive: TestScore, resultsGuided: TestScore } {
        console.log('testing population')

        //console.log('testing population2')
        //let points = 0;
        //let results: TestScore = {score: 0, wins: 0, losses: 0, draws: 0, lossRate: 0, winRate: 0};
        //let matches: number[][] = [];
        //console.log('testing population3')
        let _depth = this.depth;
        this.depth = Math.max(this.testDepth, this.depth);
        console.log(this.depth)
        //console.log(this.population)

        //console.log("here")
        //console.log(this.population.size)

        let testIds: number[] = [];

        let resultsRandom: TestScore = {score: 0, winloss: 0, wins: 0, losses: 0, draws: 0, lossRate: 0, winRate: 0, botType: 'random'};

        testIds.push(this.population.addTestBot());
        let resultsNaive: TestScore = {score: 0, winloss: 0, wins: 0, losses: 0, draws: 0, lossRate: 0, winRate: 0, botType: 'naive'};
        let matchesNaive: number[][] = [];
        testIds.push(this.population.addTestBot2());
        let resultsGuided: TestScore = {score: 0, winloss: 0, wins: 0, losses: 0, draws: 0, lossRate: 0, winRate: 0, botType: 'guided'};
        let matchesGuided: number[][] = [];

        //console.log(this.population)

        //if (this.population.size > 30 && !testAll) {
        let testOpps: number[]
        if (!testAll) {
            let count = Math.min(Math.max(Math.min(5, this.population.size), Math.floor(this.population.size * 0.5)), 50);
            console.log(`reducing population to ${count} for testing (from ${this.population.size})`)
            //const testOpps = getRandomSample([...Array(this.population.size).keys()], 200)
            testOpps = this.population.getBestNMembers(count);
            console.log(testOpps)
            for (let i = 0; i < testOpps.length; i++) {
                matchesNaive.push([testIds[0], testOpps[i]]);
                matchesNaive.push([testOpps[i], testIds[0]]);
                matchesGuided.push([testIds[1], testOpps[i]]);
                matchesGuided.push([testOpps[i], testIds[1]]);
            }
            //console.log(matches)
        } else {
            testOpps = [...Array(this.population.size).keys()];
            for (let i = 0; i < this.population.size; i++) {
                //for (const id of testIds) {
                matchesNaive.push([testIds[0], i]);
                matchesNaive.push([i, testIds[0]]);
                matchesGuided.push([testIds[1], i]);
                matchesGuided.push([i, testIds[1]]);
            }
        }

        function randomCompete(botIndex: number, randomPlayer: Player, moveLimit: number, depth: number, population: Map<number, WeightSet>, boardStatsDatabase: HashMap): Status {
            let checkers = new CheckersGame();
            let status = 0;
            let moveIndex = 0;

            let boardStack: number[][] = [];
            let nonManMoves: number = 0;

            while (moveIndex < moveLimit) {
                let moves = checkers.getMoves();
                status = (moves.length == 0) ? (checkers.player === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON) : Status.PLAYING;
                if (status !== 0) {
                    return status;
                }
                let move: Move;
                if (checkers.player == randomPlayer) {
                    move = moves[Math.floor(Math.random() * moves.length)];
                } else {
                    move = minimax(checkers, depth, population, botIndex, boardStatsDatabase);
                }
                checkers = checkers.makeMove(move);

                (move.end & checkers.board.king) && !move.captures ? nonManMoves++ : nonManMoves = 0;
                boardStack.push([checkers.board.white, checkers.board.black, checkers.board.king]);
                if (boardStack.length > 10) boardStack.shift();

                let s = checkDraw(boardStack, nonManMoves)
                if (s !== Status.PLAYING) {
                    return s;
                }
                moveIndex++;
            }
            return Status.DRAW_MOVELIMIT;
        }

        function applyScoreRandom(status: Status, results: TestScore, white: boolean) {
            if (status > 2) {
                results.draws += 1;
            } else if ((status === Status.WHITE_WON && white) || (status === Status.BLACK_WON && !white)) {
                results.wins += 1;
            } else {
                results.losses += 1;
            }
        }

        for (let j = 0; j < testOpps.length; j++) {
            let status = randomCompete(testOpps[j], Player.WHITE, this.moveLimit, this.depth, this.population.population, this.boardStatsDatabase);
            applyScoreRandom(status, resultsRandom, false);
            status = randomCompete(testOpps[j], Player.BLACK, this.moveLimit, this.depth, this.population.population, this.boardStatsDatabase);
            applyScoreRandom(status, resultsRandom, true);

            //console.log(`random test ${j} of ${testOpps.length} complete`)
        }
        console.log(resultsRandom)

        
        //let times: number[][] = [];
        for (let j = 0; j < matchesNaive.length; j++) {
            let index1 = matchesNaive[j][0];
            let index2 = matchesNaive[j][1];
            let status = this.compete([index1, index2]);

            if (status > 2) {
                resultsNaive.draws += 1;
            } else if ((status === Status.WHITE_WON && index2 === -1) || (status === Status.BLACK_WON && index1 === -1)) {
                resultsNaive.wins += 1;
            } else {
                resultsNaive.losses += 1;
            }
        }


        //times = [];
        for (let j = 0; j < matchesGuided.length; j++) {
            let index1 = matchesGuided[j][0];
            let index2 = matchesGuided[j][1];
            let status = this.compete([index1, index2]);

            if (status > 2) {
                resultsGuided.draws += 1;
            } else if ((status === Status.WHITE_WON && index2 === -2) || (status === Status.BLACK_WON && index1 === -2)) {
                resultsGuided.wins += 1;
                //let winnerIndex = index1 === -2 ? index2 : index1;
                //let weights = this.population.population.get(winnerIndex)!.weights;
                //if (!this.guidedWinners.includes(weights) && writeWinners) {
                //    this.guidedWinners.push(weights);
                //    let log = {
                //        "weights": weights,
                //        "colour": index1 == -2 ? 'black' : 'white',
                //    }
                //    let json = JSON.stringify(log);
                //    writeToFile('guidedWinners.json', json)
                //}
                
            } else {
                resultsGuided.losses += 1;
            }
        }
        //console.log(times)


        this.depth = _depth;

        function edgeCases(results: TestScore) {
            if (results.wins == 0) {
                results.winloss = 0;
                if (results.draws == 0) {
                    results.score = 0;
                }
            } else if (results.losses == 0 && results.draws == 0) {
                results.winloss = 1;
                results.score = 1;
            } else if (results.losses == 0) {
                results.winloss = 1;
            }
        }
        
        //0.5 used as DRAW_SCORE for testing score to keep evaluation uniform
        resultsRandom.score = roundTo((resultsRandom.wins + (0.5 * resultsRandom.draws)) / (resultsRandom.wins + resultsRandom.losses + resultsRandom.draws), 3);
        resultsNaive.score = roundTo((resultsNaive.wins + (0.5 * resultsNaive.draws)) / (resultsNaive.wins + resultsNaive.losses + resultsNaive.draws), 3);
        resultsGuided.score = roundTo((resultsGuided.wins + (0.5 * resultsGuided.draws)) / (resultsGuided.wins + resultsGuided.losses + resultsGuided.draws), 3);

        resultsRandom.winloss = roundTo(resultsRandom.wins / (resultsRandom.wins + resultsRandom.losses), 3);
        resultsNaive.winloss = roundTo(resultsNaive.wins / (resultsNaive.wins + resultsNaive.losses), 3);
        resultsGuided.winloss = roundTo(resultsGuided.wins / (resultsGuided.wins + resultsGuided.losses), 3);


        edgeCases(resultsRandom);
        edgeCases(resultsNaive);
        edgeCases(resultsGuided);


        /*if (resultsNaive.wins == 0) {
            resultsNaive.winloss = 0;
            if (resultsNaive.draws == 0) {
                resultsNaive.score = 0;
            }
        } else if (resultsNaive.losses == 0 && resultsNaive.draws == 0) {
            resultsNaive.winloss = 1;
            resultsNaive.score = 1;
        } else if (resultsNaive.losses == 0) {
            resultsNaive.winloss = 1;
        }

        if (resultsGuided.wins == 0) {
            resultsGuided.winloss = 0;
            if (resultsNaive.draws == 0) {
                resultsGuided.score = 0;
            }
        } else if (resultsGuided.losses == 0 && resultsGuided.draws == 0) {
            resultsGuided.winloss = 1;
            resultsGuided.score = 1;
        } else if (resultsGuided.losses == 0) {
            resultsGuided.winloss = 1;
        }*/

        resultsRandom.lossRate = roundTo(resultsRandom.losses / (resultsRandom.wins + resultsRandom.losses + resultsRandom.draws), 3);
        resultsNaive.lossRate = roundTo(resultsNaive.losses / (resultsNaive.wins + resultsNaive.losses + resultsNaive.draws), 3);
        resultsGuided.lossRate = roundTo(resultsGuided.losses / (resultsGuided.wins + resultsGuided.losses + resultsGuided.draws), 3);

        resultsRandom.winRate = roundTo(resultsRandom.wins / (resultsRandom.wins + resultsRandom.losses + resultsRandom.draws), 3);
        resultsNaive.winRate = roundTo(resultsNaive.wins / (resultsNaive.wins + resultsNaive.losses + resultsNaive.draws), 3);
        resultsGuided.winRate = roundTo(resultsGuided.wins / (resultsGuided.wins + resultsGuided.losses + resultsGuided.draws), 3);


        for (let i = 0; i < testIds.length; i++) {
            this.population.destroyBot(testIds[i]);
        }

        let results: TestResults = {'random': resultsRandom, 'naive': resultsNaive, 'guided': resultsGuided}; 
        
        //console.log('test results', results)

        return results;

    }


    testWinners(weightList: BoardStats[]): BoardStats {

        let matches: number[][];
        let botCount = weightList.length;
        //let results = new Map<string, Result>()
        let results: Result[] = []
        let scores = new Map<number, number>()
        //let bots: string[]
        let bots: string[]

        this.population.initPopFromWeights(weightList);

        //for (const bot in this.population.population.keys()) {
        //    bots.push(bot.toString());
        //}

        let _depth = this.depth;
        this.depth = 7;

        console.log(weightList)

        console.log(this.population.population)


        matches = getPopulationMatches(botCount, 0);

        let testIds: number[] = [];
        testIds.push(this.population.addTestBot());
        testIds.push(this.population.addTestBot2());
        for (let i = 0; i < weightList.length; i++) {
            //let m = permutations([...testIds, i], 2);
            //console.log(i, m)
            //matches = [...matches, ...m];
            matches.push([testIds[0], i]);
            matches.push([i, testIds[0]]);
            matches.push([testIds[1], i]);
            matches.push([i, testIds[1]]);
            /*matches.push([testIds[0], testIds[1]]);
            matches.push([testIds[1], testIds[0]]);*/
            scores.set(i, 0)
        }
        matches.push([testIds[0], testIds[1]]);
        matches.push([testIds[1], testIds[0]])
        for (let i = 0; i < testIds.length; i++) {
            scores.set(testIds[i], 0)
        }
        //console.log(matches)

        console.log(this.population.population.keys())
        //console.log([...this.population.population.keys()])
        //for (const bot in [...this.population.population.keys()]) {
        //    console.log(bot)
        //    bots.push(bot);
        //}
        //const keys = [...this.population.population.keys()].map()
        //bots = [...this.population.population.keys()].sort((a, b) => a - b)//.map((bot) => bot.toString());
        bots = [...this.population.population.keys()].sort((a, b) => a - b).map((bot) => bot.toString());
        console.log(bots)
        

        //console.log('-2 matches')
        //let neg2 = matches.filter((match) => match[0] == -2 || match[1] == -2)
        //console.log(neg2)
        //console.log('1 matches')
        //let pos1 = matches.filter((match) => match[0] == 1 || match[1] == 1)
        //console.log(pos1)

        for (let j = 0; j < matches.length; j++) {
            let index1 = matches[j][0];
            let index2 = matches[j][1];
            let status = this.compete([index1, index2]);
            //let status = await this.compete([index1, index2]);
            /*let status: number;
            this.compete([index1, index2]).then((result) => {
                status = result;
            }).catch((err) => {
                status = 0;
                console.error(err);
            });*/
            //results.set(index1.toString().concat(",",index2.toString()), {'white': index1, 'black': index2, 'result': status === 0 ? 0 : status === 1 ? 1 : -1});
            //results.push({'white': index1, 'black': index2, 'result': status === 0 ? 0 : status === 1 ? 1 : -1});
            results.push({'white': index1, 'black': index2, 'result': status});
            if (status > 2) {
                scores.set(index1, scores.get(index1)! + 0.5);
                scores.set(index2, scores.get(index2)! + 0.5);
            } else {
                let index = status === 1 ? index1 : index2;
                scores.set(index, scores.get(index)! + 1);
            }
        }

        this.depth = _depth;

        const table = generateResultsTable(results, bots, scores);
        console.table(table);

        //writeToFile('testScores.txt', JSON.stringify(results));
        writeToFile('testScores_log.txt', JSON.stringify(table));
        

        // get the maximum value using Math.max()
        const maxVal = Math.max(...scores.values());

        let bestKey: number | undefined = undefined;

        // find the key that corresponds to the maximum value
        for (const [key, value] of scores.entries()) {
            if (value === maxVal) {
                if (bestKey === undefined) {
                    bestKey = key;
                } else {
                    let r = 0
                    let headToHead1 = results.find((result) => (result.white === key && result.black === bestKey));
                    if (headToHead1) {
                        if (headToHead1.result === 1) {
                            r -= 1;
                        } else if (headToHead1.result === 2) {
                            r += 1;
                        }
                    }
                    let headToHead2 = results.find((result) => (result.white === bestKey && result.black === key));
                    if (headToHead2) {
                        if (headToHead2.result === 1) {
                            r += 1;
                        } else if (headToHead2.result === 2) {
                            r -= 1;
                        }
                    }
                    if (r > 0) bestKey = key;
                }
            }
        }

        console.log(`The key with the highest value is "${bestKey}"`);
        writeToFile('trainingWinners.json', JSON.stringify({"weights": this.population.population.get(bestKey!)!.weights, "generations": weightList.length}));
        writeToFile('testScores_log.txt', getTime(), false)
        writeToFile('testScores_log.txt', 'Best Weights:' + JSON.stringify(JSON.stringify({"weights": this.population.population.get(bestKey!)!.weights, "generations": weightList.length})));

        //console.log('test results', results)
        console.log('scores', scores)

        let bestParams = this.population.population.get(bestKey!)!.weights;
        //console.log('best params', bestParams)

        for (let i = 0; i < testIds.length; i++) {
            this.population.destroyBot(testIds[i]);
        }

        return bestParams;


    }

    //TODO: Visualise the board
    // Visualise plot of score by generation
    // visualise parameters (bar chart -1 to 1)
    async getPopulationFromJSONFile(filename: string = '../inputGen.json'): Promise<Map<number, WeightSet> | void> {
        
        try {
            const json = await loadPopFromJSON(filename);
            const population = new Map<number, WeightSet>(
                Object.entries(json).map(([key, value]) => [+key, value as WeightSet])
            );
            return population;
        } catch (err) {
            console.log("Error: ", err);
            return Promise.reject(err);
        }

    }


    async testFromJSONFile(filename: string = '../inputGen.json'): Promise<void> {
        
        try {
            const result = await this.getPopulationFromJSONFile(filename);
            console.log('r',result);
            if (!result || !(result instanceof Map)) {
                throw new Error('Error loading population from JSON file');
            }
            this.population = new Population({population: result});
            const testStart = performance.now();
            const testScore = this.testPopulation(true);
            const testTime = performance.now() - testStart;
            testScore['testTime'] = testTime;
            console.log(testScore);
            console.log('test time', testTime);
            writeToFile('testScores_log.txt', '\n\nTesting from JSON file: ' + filename);
            writeToFile('testScores_log.txt', JSON.stringify(testScore));
        } catch (err) {
            console.log("Error: ", err);
            return Promise.reject(err);
        }
        
    }

    async competeFromJSONFile(filename: string = '../inputGen.json'): Promise<void> {
        
        try {
            const result = await this.getPopulationFromJSONFile(filename);
            console.log('r',result);
            if (!result || !(result instanceof Map)) {
                throw new Error('Error loading population from JSON file');
            }
            this.population = new Population({population: result});

            let weights = this.population.getWeights();
            let bestWeights = this.testWinners(weights);
            writeToFile('testScores_log.txt', '\n\nCompeting from JSON file: ' + filename + ' best weights:');
            writeToFile('testScores_log.txt', JSON.stringify(bestWeights));
        } catch (err) {
            console.log("Error: ", err);
            return Promise.reject(err);
        }
        
    }


    //working
    async continueTrainingFromJSONFile(method: string, logFile: string, generation: number) {
        //if (logFile == 'latest') {
            //const files = getFiles('./generation_log');
            //const latest = files[files.length - 1];
        //    logFile = await getLastFilenameInDirectory('./generation_log');
        //    console.log('latest file', logFile)
        //}

        try {
            const pop = await this.getPopulationFromJSONFile();
            console.log('r',pop);
            if (!pop || !(pop instanceof Map)) {
                throw new Error('Error loading population from JSON file');
            }
            let population = new Population({population: pop});
            this.standardTraining(method, generation, population.population, logFile);
        } catch (err) {
            console.log("Error: ", err);
            return Promise.reject(err);
        }

        //this.standardTraining(method);

        //return Promise.resolve(logFile)

        //const json = loadJSONFile(logFile);


    }

    generatePreloadedDatabase(openingDepth: number = 8, gameDepth: number = 9, maxPieces: number = 6) {
        this.boardStatsDatabase.generate(openingDepth, gameDepth, maxPieces);
    }

    /*generatePreloadedDatabase(openingDepth: number = 8, gameDepth: number = 9, maxPieces = 4): void {

        let lengthBefore: number = boardStatsDatabase.getSize();

        this.generateOpeningBookPositions(openingDepth);
        //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved in opening book`)
        console.log(`${boardStatsDatabase.getSize() - lengthBefore} boards saved after opening book`)
        this.naivePlaythough(gameDepth);
        //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved in naive game`)
        console.log(`${boardStatsDatabase.getSize() - lengthBefore} boards saved after naive game`)
        this.generateEndgameDatabase(maxPieces);
        
        //console.log(`${Object.keys(boardStatsDatabase).length - lengthBefore} boards saved`)
        console.log(`${boardStatsDatabase.getSize() - lengthBefore} boards saved after endgame database`)
    }
 

    generateOpeningBookPositions(openingDepth: number): void {

        let checkers = new CheckersGame();

        function getNextMoves(checkers: CheckersGame, depth: number) {
            if ( depth === 0 ) return

            for (const move of checkers.getMoves()) {
                const newCheckers = checkers.makeMove(move);
                //newCheckers.board.getBoardStats(true, false);
                const p = newCheckers.player === Player.WHITE ? newCheckers.board.black : newCheckers.board.white;
                newCheckers.board.persistStatsForValue(p, newCheckers.player === Player.WHITE ? Player.BLACK : Player.WHITE)
                //console.log(boardStatsDatabase.size)
                getNextMoves(newCheckers, depth - 1);
            }
        }

        checkers.board.persistStatsForValue(checkers.board.white, Player.WHITE);
        getNextMoves(checkers, openingDepth)

    }

    naivePlaythough(depth: number) {
        let c = new CheckersGame();
        for (let moveIndex = 0; moveIndex < 200; moveIndex++) {
            let moves = c.getMoves();
            if (moves.length == 0) return
            let move = naiveMinimax(c, depth);
            c = c.makeMove(move);
        }
    }


    generateEndgameDatabase(maxPieces: number): void {
        let i = 0;
        let b = new Board();

        function generatePositions(board: number, maxPieces: number, callback: (pieces: number) => void): void {
            if (maxPieces === 0) {
                return;
            }
            for (let i = 0; i < 32; i++) {
                if ((board & (1 << i)) === 0) {
                    // Place a piece on this square
                    const newBoard = board | (1 << i);
                    callback(newBoard);
                    generatePositions(newBoard, maxPieces - 1, (pieces) => {
                        callback(pieces);
                    });
                }
            }
            return;
        }

        generatePositions(0, maxPieces, (pieces) => {
            // Call myfunc for each possible arrangement
            //b.getStatsForValue(pieces, kings);
            b.persistStatsForValue(pieces, Player.WHITE);
            i++
        });
        console.log(i)
    }*/



    
    /*generateAllCombinations(value: number): number[] {
        const combinations = [];
        const bitCount = getPieceCount(value);
        const max = (1 << bitCount) - 1;
        const indices = [];
        let count = 0;
    
        // Get the indices of the set bits in num
        for (let i = 0; i < 32; i++) {
            if (value & (1 << i)) {
                indices.push(i);
                count++;
            }
        }
    
        // Generate all combinations of k set bits
        for (let i = 0; i <= max; i++) {
            if (getPieceCount(i) === bitCount) {
                let current = 0;
                for (let j = 0; j < bitCount; j++) {
                    current |= (1 << indices[j]);
                    if (!(i & (1 << j))) {
                        current ^= (1 << indices[j]);
                    }
                }
                combinations.push(current);
            }
        }
    
        return combinations;
    }*/
    
    /*function countSetBits(num) {
        let count = 0;
    
        while (num) {
            count += num & 1;
            num >>= 1;
        }
    
        return count;
    }*/
    
    //const num = parseInt('010110', 2);
    //const k = 3;
    //const combinations = generateAllCombinations(num, k);
    
    //console.log(combinations);
    // Output: [22, 20, 18, 6, 4, 2, 0]    




    /*generatePositions1(board: number, maxPieces: number, callback: (pieces: number, kings: number) => void): void {
        if (maxPieces === 0) {
            return;
        }
        for (let i = 0; i < 32; i++) {
            if ((board & (1 << i)) === 0) {
                // Place a piece on this square
                const newBoard = board | (1 << i);
                // Generate all possible permutations of kings
                const kingsCombinations = [];
                for (let j = 0; j <= i; j++) {
                    let kingsBoard = (1 << j);
                    kingsCombinations.push(kingsBoard);
                    if (j !== i) {
                        for (let k = j + 1; k <= i; k++) {
                            kingsBoard |= (1 << k);
                            kingsCombinations.push(kingsBoard);
                        }
                    }
                }
                console.log('kingsCombinations', kingsCombinations)
                // Generate positions with each kings permutation
                for (const kingsBoard of kingsCombinations) {
                    console.log('outer', newBoard, kingsBoard)
                    //callback(newBoard, kingsBoard);
                    // Recursively generate positions with one more piece
                    this.generatePositions(newBoard, maxPieces - 1, (pieces, subKings) => {
                        // Combine kings permutation with sub kings
                        const combinedKings = kingsBoard & subKings;
                        //console.log('inner', pieces, combinedKings)
                        callback(pieces, combinedKings);
                    });
                }
            }
        }
    }*/


    trial(): BoardStats {

        let matches: number[][] = [];
        let results: Result[] = []
        let scores = new Map<number, number>()
        //let bots: string[]

        this.population = new Population({populationSize:0});

        let _depth = this.depth;
        this.depth = 7;

        let testIds: number[] = [];
        testIds.push(this.population.addTestBot());
        testIds.push(this.population.addTestBot2());
        matches.push([testIds[0], testIds[1]]);
        matches.push([testIds[1], testIds[0]])
        for (let i = 0; i < testIds.length; i++) {
            scores.set(testIds[i], 0)
        }

        for (let j = 0; j < matches.length; j++) {
            let index1 = matches[j][0];
            let index2 = matches[j][1];
            let status = this.compete([index1, index2]);
            results.push({'white': index1, 'black': index2, 'result': status});
            if (status > 2) {
                scores.set(index1, scores.get(index1)! + DRAW_SCORE);
                scores.set(index2, scores.get(index2)! + DRAW_SCORE);
            } else {
                let index = status === 1 ? index1 : index2;
                scores.set(index, scores.get(index)! + 1);
            }
        }

        console.log(results)

        this.depth = _depth;
        
        // get the maximum value using Math.max()
        const maxVal = Math.max(...scores.values());

        let bestKey: number | undefined = undefined;

        // find the key that corresponds to the maximum value
        for (const [key, value] of scores.entries()) {
            if (value === maxVal) {
                if (bestKey === undefined) {
                    bestKey = key;
                } else {
                    let r = 0
                    let headToHead1 = results.find((result) => (result.white === key && result.black === bestKey));
                    if (headToHead1) {
                        if (headToHead1.result === 1) {
                            r -= 1;
                        } else if (headToHead1.result === 2) {
                            r += 1;
                        }
                    }
                    let headToHead2 = results.find((result) => (result.white === bestKey && result.black === key));
                    if (headToHead2) {
                        if (headToHead2.result === 1) {
                            r += 1;
                        } else if (headToHead2.result === 2) {
                            r -= 1;
                        }
                    }
                    if (r > 0) bestKey = key;
                }
            }
        }

        console.log(`The key with the highest value is "${bestKey}"`);
      
        console.log('scores', scores)

        let bestParams = this.population.population.get(bestKey!)!.weights;
        //console.log('best params', bestParams)

        for (let i = 0; i < testIds.length; i++) {
            this.population.destroyBot(testIds[i]);
        }

        return bestParams;


    }/**/


}

