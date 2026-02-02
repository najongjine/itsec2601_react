import React, { useMemo } from "react";
import { CellType, Grid, Point } from "./types";
import "./Maze.css";

interface MazeRendererProps {
  grid: Grid;
  mousePosition: Point;
  showPath?: boolean; // Optional: for debugging or showing the calculated path
  path?: Point[];
}

const MazeRenderer: React.FC<MazeRendererProps> = ({
  grid,
  mousePosition,
  path,
}) => {
  if (!grid || grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  const cellSize = 15; // Matching CSS

  // Determine if a cell is on the calculated path
  const isPathCell = (x: number, y: number) => {
    if (!path) return false;
    return path.some((p) => p.x === x && p.y === y);
  };

  return (
    <div
      className="maze-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          let className = "maze-cell";
          if (cell === CellType.Wall) className += " cell-wall";
          else if (cell === CellType.Path) className += " cell-path";
          else if (cell === CellType.Start) className += " cell-start";
          else if (cell === CellType.End) className += " cell-end";

          // Optional: Highlight A* path lightly
          // if (isPathCell(x, y) && cell === CellType.Path) {
          //     style = { backgroundColor: '#d6eaf8' };
          // }

          return (
            <div key={`${x}-${y}`} className={className}>
              {mousePosition.x === x && mousePosition.y === y && (
                <div className="mouse-avatar">🐭</div>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
};

export default MazeRenderer;
