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