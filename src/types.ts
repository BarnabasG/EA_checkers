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

export interface PopulationSet {
    [key: number]:  WeightSet;
    
}

export interface BoardDatabase {
    [key: string]:  BoardStats;
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