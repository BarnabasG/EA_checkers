export type Move = {
    start: number;
    end: number;
    captures: number;
};

export enum Player {
    WHITE,
    BLACK,
}