export interface Point {
  x: number;
  y: number;
}

export const CellType = {
  Wall: 0,
  Path: 1,
  Start: 2,
  End: 3,
} as const;

export type CellType = (typeof CellType)[keyof typeof CellType];

export type Grid = CellType[][];

export interface MazeConfig {
  width: number;
  height: number;
}
