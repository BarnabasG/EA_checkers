import { minimax } from "./ai";
import { CheckersGame } from "./checkers";
import { BoardStats, Move, Pattern, Player, PopStats, PopulationParams, Result, Status, TestResults, TestScore, TrainingParams, WeightInit, WeightSet } from "./types";
import { getPopulationMatches, checkDraw, writeToFile, loadPopFromJSON, generateResultsTable, roundTo, getStandardDeviation, getTime } from "./helper";
import { Population } from "./population";
import { STANDARD_TRAINING_PATTERNS } from "./trainingPatterns";
import { HashMap } from './database';


const DRAW_SCORE = 0.4;

export class Checkers {

    private population!: Population;
    private moveLimit: number;
    private depth: number;
    public bestWeights!: BoardStats;
    private testDepth: number;
    public boardStatsDatabase: HashMap;

    constructor() {
        this.moveLimit = 200;
        this.testDepth = 5;
        this.depth = 5;
        this.boardStatsDatabase = new HashMap();
    }



    train(trainingParams: TrainingParams) {

        if (trainingParams == undefined) {
            trainingParams = {
                trainingMethod: 'testPattern',
                startGeneration: 0,
                generations: 5
            }
        }

        this.standardTraining(trainingParams.trainingMethod!);
    }

    // make two member of the population compete and find the winner
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

            let s = checkDraw(boardStack, nonManMoves)
            if (s !== Status.PLAYING) {
                return s;
            }

            moveIndex++;
        }
        return Status.DRAW_MOVELIMIT;
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

        const pattern: Pattern = STANDARD_TRAINING_PATTERNS[method];
        const maxDefGen = Math.max(...Object.getOwnPropertyNames(pattern).map(Number).filter(n => n !== 999));

        var defaultValues: TrainingParams = {
            startGeneration: startGen,
            depth: undefined,
            moveLimit: 250,
            generations: maxDefGen,
            populationSize: undefined,
            competitionType: 0,     
            test: true,
            testDepth: 5,
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

        let matches: number[][];

        this.moveLimit = params.moveLimit!;
        this.testDepth = params.testDepth!;

        let testScores: TestResults[] = [];
        let winners: BoardStats[] = [];

        var trainingInstance: string;
        let logtime = new Date().toLocaleString().replace(/:/g, '-').replace(/\//g, '-').replace(/ /g, '_').replace(/,/g, '');
        if (logfile) {
            trainingInstance = `generation_log/${logfile}_CONTINUED_${logtime}.txt`;
            writeToFile(trainingInstance, `\n\n//CONTINUING TRAINING - ${logfile}//\n`);
            writeToFile('testScores_log.txt', '//CONTINUING TRAINING//'+logfile);
        } else {
            trainingInstance = `generation_log/log_${logtime}.txt`;
        }

        for (let gen=params.startGeneration!; gen<params.generations!; gen++) {
            
            console.log(`generation ${gen}/${params.generations!-1}`)
            params = this.getParams(defaultValues, pattern[Math.min(maxDefGen, gen)]);
            if (popOverride) {
                params.populationSize = this.population.size;
                popOverride = false;
            }

            console.log(gen, params)

            this.depth = params.depth!;

            const time = getTime()
            writeToFile('testScores_log.txt', time.concat(" ",gen.toString(),": "));
            writeToFile('testScores_log.txt', JSON.stringify(params));

            matches = getPopulationMatches(params.populationSize!, params.competitionType, params.matchCount);

            let value: WeightSet;
            let index: number;

            let genStart = performance.now();
            
            console.log("Starting matches")
            for (let j = 0; j < matches.length; j++) {
                if (j%10 == 0) console.log(`Generation ${gen}: match ${j}/${matches.length}`)
                let index1 = matches[j][0];
                let index2 = matches[j][1];
                let status = this.compete([index1, index2]);
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
            }

            let popData = this.getPopulationMap();
            if (params.test) popData.set('testScore', testScore!);
            popData.set('generation', gen);
            let genTime = performance.now() - genStart;
            popData.set('generation time', genTime);
            const savePop = Object.fromEntries(popData);
            writeToFile(trainingInstance, JSON.stringify(savePop));
            console.log(`${genTime}ms`)
            console.log('saved evals', this.population.population.get(0)!.evaluationDB.length, this.population.population.get(1)!.evaluationDB.size, this.population.population.get(2)!.evaluationDB.size) 
            let patternIndex = Math.min(maxDefGen, gen+1);
            if (gen+1 < params.generations!) this.population.nextGeneration(pattern[patternIndex].populationSize, params.generationParams);

        }
        console.log("generations complete")
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
        };
        return mergedParams;
    }

    getPopulationMap(): Map<string, any> {
        let popData = new Map<string, any>();
        popData.set('population', new Map<number, WeightSet>());
        for (let [key, weightSet] of this.population.population.entries()) {
            popData.get('population')!.set(key, { ...weightSet, evaluationDB: {} });
        }
        popData.set('population', Object.fromEntries(popData.get('population')!.entries()))
        return popData
    }


    getParamAlanysis() {

        let count = Math.min(Math.max(Math.min(15, this.population.size), this.population.size * 0.5), 50);
        console.log(`reducing population to ${count} for param analysis (from ${this.population.size})`)
        const newpop = this.population.getBestNMembers(count);

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

        
    testPopulation(testAll: boolean = false): TestResults { //{resultsNaive: TestScore, resultsGuided: TestScore } {
        console.log('testing population')

        let _depth = this.depth;
        this.depth = Math.max(this.testDepth, this.depth);
        console.log(this.depth)

        let testIds: number[] = [];

        let resultsRandom: TestScore = {score: 0, winloss: 0, wins: 0, losses: 0, draws: 0, lossRate: 0, winRate: 0, botType: 'random'};

        testIds.push(this.population.addTestBot());
        let resultsNaive: TestScore = {score: 0, winloss: 0, wins: 0, losses: 0, draws: 0, lossRate: 0, winRate: 0, botType: 'naive'};
        let matchesNaive: number[][] = [];
        testIds.push(this.population.addTestBot2());
        let resultsGuided: TestScore = {score: 0, winloss: 0, wins: 0, losses: 0, draws: 0, lossRate: 0, winRate: 0, botType: 'guided'};
        let matchesGuided: number[][] = [];

        let testOpps: number[]
        if (!testAll) {
            let count = Math.min(Math.max(Math.min(5, this.population.size), Math.floor(this.population.size * 0.5)), 50);
            console.log(`reducing population to ${count} for testing (from ${this.population.size})`)
            testOpps = this.population.getBestNMembers(count);
            console.log(testOpps)
            for (let i = 0; i < testOpps.length; i++) {
                matchesNaive.push([testIds[0], testOpps[i]]);
                matchesNaive.push([testOpps[i], testIds[0]]);
                matchesGuided.push([testIds[1], testOpps[i]]);
                matchesGuided.push([testOpps[i], testIds[1]]);
            }
        } else {
            testOpps = [...Array(this.population.size).keys()];
            for (let i = 0; i < this.population.size; i++) {
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
        }
        console.log(resultsRandom)

        
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

        for (let j = 0; j < matchesGuided.length; j++) {
            let index1 = matchesGuided[j][0];
            let index2 = matchesGuided[j][1];
            let status = this.compete([index1, index2]);

            if (status > 2) {
                resultsGuided.draws += 1;
            } else if ((status === Status.WHITE_WON && index2 === -2) || (status === Status.BLACK_WON && index1 === -2)) {
                resultsGuided.wins += 1;
                
            } else {
                resultsGuided.losses += 1;
            }
        }

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
        
        return results;
    }


    testWinners(weightList: BoardStats[]): BoardStats {

        let matches: number[][];
        let botCount = weightList.length;
        let results: Result[] = []
        let scores = new Map<number, number>()
        let bots: string[]

        this.population.initPopFromWeights(weightList);

        let _depth = this.depth;
        this.depth = 7;

        console.log(weightList)
        console.log(this.population.population)

        matches = getPopulationMatches(botCount, 0);

        let testIds: number[] = [];
        testIds.push(this.population.addTestBot());
        testIds.push(this.population.addTestBot2());
        for (let i = 0; i < weightList.length; i++) {
            matches.push([testIds[0], i]);
            matches.push([i, testIds[0]]);
            matches.push([testIds[1], i]);
            matches.push([i, testIds[1]]);
            scores.set(i, 0)
        }
        matches.push([testIds[0], testIds[1]]);
        matches.push([testIds[1], testIds[0]])
        for (let i = 0; i < testIds.length; i++) {
            scores.set(testIds[i], 0)
        }

        bots = [...this.population.population.keys()].sort((a, b) => a - b).map((bot) => bot.toString());

        for (let j = 0; j < matches.length; j++) {
            let index1 = matches[j][0];
            let index2 = matches[j][1];
            let status = this.compete([index1, index2]);
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
        console.log('scores', scores)

        let bestParams = this.population.population.get(bestKey!)!.weights;

        for (let i = 0; i < testIds.length; i++) {
            this.population.destroyBot(testIds[i]);
        }

        return bestParams;


    }

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

    async continueTrainingFromFile(method: string, logFile: string, generation: number) {

        try {
            const pop = await this.getPopulationFromJSONFile();
            console.log('r',pop);
            if (!pop || !(pop instanceof Map)) {
                throw new Error('Error loading population from file');
            }
            let population = new Population({population: pop});
            this.standardTraining(method, generation, population.population, logFile);
        } catch (err) {
            console.log("Error: ", err);
            return Promise.reject(err);
        }

    }

    generatePreloadedDatabase(openingDepth: number = 8, gameDepth: number = 9, maxPieces: number = 6) {
        this.boardStatsDatabase.generate(openingDepth, gameDepth, maxPieces);
    }
}

