export type Move = {
    start: number;
    end: number;
    captures: number;
};

export enum Player {
    WHITE,
    BLACK,
}

export enum Status {
    PLAYING,
    WHITE_WON,
    BLACK_WON,
}

export interface BoardStats {
    [key: string]:  number;
}

export type WeightSet = {
    weights:  BoardStats;
    score: number;
}

export interface TrainingParams {
    standard?: boolean;
    standardMethod?: string;
    depth?: number;
    moveLimit?: number;
    generations?: number;
    populationSize?: number;
    competitionType?: number;
    selectionMethod?: number;
    mutationVariance?: number;
    selectionPercent?: number;
    keepTopPercent?: number;
    matchCount?: number;
    populationSizePattern?: number[];
}

export interface GenerationParams {
    size?: number
    selectionMethod?: number
    mutationVariance?: number
    selectionPercent?: number
    keepTopPercent?: number
}

export type Pattern = {
    [key: number]: TrainingParams;
}

export interface TrainingPatterns {
    [key: string]: Pattern;
}

export interface PopulationSet {
    [key: number]: WeightSet;
}

export interface BoardDatabase {
    [key: string]: BoardStats;
}

/*export type BoardStats = {
    men: : number;
    kings: number;
    avrDist: number;
    backline: number;
    corners: number;
    edges: number;
    centre2: number;
    centre4: number;
    centre8: number;
    defended: number;
    attacks: number;
}*/