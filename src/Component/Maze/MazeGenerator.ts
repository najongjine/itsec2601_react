import { CellType, Grid, Point } from "./types";

export class MazeGenerator {
  private width: number;
  private height: number;
  private grid: Grid;

  constructor(width: number, height: number) {
    // Ensure odd dimensions for the wall/path algorithm to work naturally
    this.width = width % 2 === 0 ? width + 1 : width;
    this.height = height % 2 === 0 ? height + 1 : height;
    this.grid = [];
  }

  public generate(): { grid: Grid; start: Point; end: Point } {
    this.initializeGrid();
    this.carvePassagesFrom(1, 1);

    const start = { x: 1, y: 1 };
    // Find a random valid end point, ideally far away, but for now just random path
    let end = this.findRandomEnd(start);

    // Mark start and end
    this.grid[start.y][start.x] = CellType.Start;
    this.grid[end.y][end.x] = CellType.End;

    return {
      grid: this.grid,
      start,
      end,
    };
  }

  private initializeGrid() {
    this.grid = [];
    for (let y = 0; y < this.height; y++) {
      const row: CellType[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push(CellType.Wall);
      }
      this.grid.push(row);
    }
  }

  private carvePassagesFrom(cx: number, cy: number) {
    const directions = [
      { x: 0, y: -2 }, // Up
      { x: 0, y: 2 }, // Down
      { x: -2, y: 0 }, // Left
      { x: 2, y: 0 }, // Right
    ];

    // Shuffle directions
    directions.sort(() => Math.random() - 0.5);

    directions.forEach((dir) => {
      const nx = cx + dir.x;
      const ny = cy + dir.y;

      if (this.isValid(nx, ny) && this.grid[ny][nx] === CellType.Wall) {
        this.grid[cy + dir.y / 2][cx + dir.x / 2] = CellType.Path;
        this.grid[ny][nx] = CellType.Path;
        this.carvePassagesFrom(nx, ny);
      }
    });
  }

  private isValid(x: number, y: number): boolean {
    return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
  }

  private findRandomEnd(start: Point): Point {
    let candidates: Point[] = [];
    for (let y = 1; y < this.height - 1; y += 2) {
      for (let x = 1; x < this.width - 1; x += 2) {
        if (
          this.grid[y][x] === CellType.Path &&
          (x !== start.x || y !== start.y)
        ) {
          candidates.push({ x, y });
        }
      }
    }

    // Simple heuristic: pick one that is somewhat far, or just random
    // Ideally we want the longest path, but simple random is okay for now as per requirements
    if (candidates.length === 0) return start;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
}
