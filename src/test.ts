

import { DraughtsBitboard } from './bitboard';
import { getBitSplitArray } from './helpers';
import { Move, Player, Status } from './types';

export class Draughts {
  readonly bitboard: DraughtsBitboard;
  readonly playerToMove: Player;

  private _moves?: Move[];

  constructor(
    bitboard: DraughtsBitboard = new DraughtsBitboard(),
    playerToMove: Player = Player.WHITE
  ) {
    this.bitboard = bitboard;
    this.playerToMove = playerToMove;
  }

  move(move: Move): Draughts {
    if (!this.moves().includes(move)) {
      throw new Error('invalid move');
    }

    const nextBitboard = this.playerToMove === Player.WHITE ?
      this.bitboard.moveWhite(move) : this.bitboard.moveBlack(move);
    const nextPlayerToMove = this.playerToMove === Player.WHITE ?
      Player.BLACK : Player.WHITE;

    return new Draughts(nextBitboard, nextPlayerToMove);
  }

  moves(): Move[] {
    if (!this._moves) {
      const jumpers = this._getJumpers();
      this._moves = jumpers ? this._generateJumps(jumpers) : this._generateMoves(this._getMovers());
    }
    return this._moves;
  }

  status(): Status {
    if (this.moves().length === 0) {
      return this.playerToMove === Player.WHITE ? Status.BLACK_WON : Status.WHITE_WON;
    }
    return Status.PLAYING;
  }

  private _generateMoves(movers: number): Move[] {
    return getBitSplitArray(movers)
      .flatMap((movers) => this._generateOriginMoves(movers));
  }

  private _generateJumps(jumpers: number): Move[] {
    return getBitSplitArray(jumpers)
      .flatMap((jumper) => this._generateOriginJumps(jumper));
  }

  private _generateOriginMoves(origin: number): Move[] {
    return this.playerToMove === Player.WHITE ?
      this.bitboard.generateOriginMovesWhite(origin) :
      this.bitboard.generateOriginMovesBlack(origin);
  }

  private _generateOriginJumps(origin: number): Move[] {
    const jumpMoves = this.playerToMove === Player.WHITE ?
      this.bitboard.generateOriginJumpWhite(origin) :
      this.bitboard.generateOriginJumpBlack(origin);

    return jumpMoves.flatMap((jumpMove) => {
      const nextJumpMoves = this.playerToMove === Player.WHITE ?
        this.bitboard.generateOriginJumpWhite(
          jumpMove.destination,
          jumpMove.origin & this.bitboard.king
        ) :
        this.bitboard.generateOriginJumpBlack(
          jumpMove.destination,
          jumpMove
