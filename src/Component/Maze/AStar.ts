import { CellType, Grid, Point } from "./types";

interface Node {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to end
  f: number; // Total cost
  parent: Node | null;
}

export class AStar {
  static findPath(grid: Grid, start: Point, end: Point): Point[] {
    const openList: Node[] = [];
    const closedList: boolean[][] = grid.map((row) => row.map(() => false));

    const startNode: Node = {
      x: start.x,
      y: start.y,
      g: 0,
      h: this.heuristic(start, end),
      f: 0,
      parent: null,
    };
    startNode.f = startNode.g + startNode.h;

    openList.push(startNode);

    while (openList.length > 0) {
      // Sort by lowest f value
      openList.sort((a, b) => a.f - b.f);
      const currentNode = openList.shift()!; // Pop the lowest f

      // Found the end
      if (currentNode.x === end.x && currentNode.y === end.y) {
        return this.reconstructPath(currentNode);
      }

      closedList[currentNode.y][currentNode.x] = true;

      const neighbors = this.getNeighbors(grid, currentNode);
      for (const neighbor of neighbors) {
        if (closedList[neighbor.y][neighbor.x]) continue;

        const gScore = currentNode.g + 1;
        let neighborNode = openList.find(
          (n) => n.x === neighbor.x && n.y === neighbor.y,
        );

        if (!neighborNode) {
          neighborNode = {
            x: neighbor.x,
            y: neighbor.y,
            g: gScore,
            h: this.heuristic(neighbor, end),
            f: 0,
            parent: currentNode,
          };
          neighborNode.f = neighborNode.g + neighborNode.h;
          openList.push(neighborNode);
        } else if (gScore < neighborNode.g) {
          neighborNode.g = gScore;
          neighborNode.f = neighborNode.g + neighborNode.h;
          neighborNode.parent = currentNode;
        }
      }
    }

    return []; // No path found
  }

  private static heuristic(a: Point, b: Point): number {
    // Manhattan distance
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private static getNeighbors(grid: Grid, node: Node): Point[] {
    const points: Point[] = [];
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const dir of directions) {
      const nx = node.x + dir.x;
      const ny = node.y + dir.y;

      if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
        if (grid[ny][nx] !== CellType.Wall) {
          points.push({ x: nx, y: ny });
        }
      }
    }
    return points;
  }

  private static reconstructPath(node: Node): Point[] {
    const path: Point[] = [];
    let current: Node | null = node;
    while (current) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }
    return path;
  }
}
