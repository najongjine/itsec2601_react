export type PlayerColor = "white" | "black";
export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";

export interface Piece {
  type: PieceType;
  color: PlayerColor;
}

export type BoardState = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}
