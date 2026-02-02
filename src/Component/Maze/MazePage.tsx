import React, { useState, useEffect, useCallback, useRef } from "react";
import { MazeGenerator } from "./MazeGenerator";
import { AStar } from "./AStar";
import MazeRenderer from "./MazeRenderer";
import { Grid, Point } from "./types";
import "./Maze.css";

const MazePage: React.FC = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [start, setStart] = useState<Point>({ x: 0, y: 0 });
  const [end, setEnd] = useState<Point>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Point>({ x: -1, y: -1 });
  const [isSolving, setIsSolving] = useState(false);
  const [path, setPath] = useState<Point[]>([]);

  // Configuration
  const WIDTH = 61;
  const HEIGHT = 41;

  const generateNewMaze = useCallback(() => {
    setIsSolving(false);
    setPath([]);
    const generator = new MazeGenerator(WIDTH, HEIGHT);
    const {
      grid: newGrid,
      start: newStart,
      end: newEnd,
    } = generator.generate();

    setGrid(newGrid);
    setStart(newStart);
    setEnd(newEnd);
    setMousePosition(newStart);
  }, []);

  // Initial load
  useEffect(() => {
    generateNewMaze();
  }, [generateNewMaze]);

  const solveMaze = () => {
    if (isSolving) return;

    const calculatedPath = AStar.findPath(grid, mousePosition, end);
    if (calculatedPath.length === 0) {
      alert("No path found (this shouldn't happen in a perfect maze!)");
      return;
    }

    setPath(calculatedPath);
    setIsSolving(true);
  };

  // Animation Loop
  useEffect(() => {
    if (!isSolving || path.length === 0) return;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex >= path.length) {
        clearInterval(intervalId);
        setIsSolving(false);
        alert("Escaped!");
        return;
      }

      setMousePosition(path[currentIndex]);
      currentIndex++;
    }, 40); // Speed of the mouse

    return () => clearInterval(intervalId);
  }, [isSolving, path]);

  return (
    <div className="maze-container">
      <h1>🐭 AI Maze Solver (A* Algorithm)</h1>
      <div className="maze-controls">
        <button
          className="maze-btn"
          onClick={generateNewMaze}
          disabled={isSolving}
        >
          Generate New Maze
        </button>
        <button className="maze-btn" onClick={solveMaze} disabled={isSolving}>
          Start Solving
        </button>
      </div>

      <MazeRenderer grid={grid} mousePosition={mousePosition} path={path} />

      <div style={{ marginTop: "20px", color: "#666" }}>
        <p>Green: Start | Red: Exit | Mouse: AI Agent</p>
      </div>
    </div>
  );
};

export default MazePage;
