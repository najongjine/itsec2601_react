import { BoardState, Position, PlayerColor } from "./ChessTypes";
import "./ChessBoard.css";

interface ChessBoardProps {
  board: BoardState;
  selectedPos: Position | null;
  validMoves: Position[];
  onSquareClick: (pos: Position) => void;
  turn: PlayerColor;
}

const PIECE_SYMBOLS: Record<string, string> = {
  "white-king": "♔",
  "white-queen": "♕",
  "white-rook": "♖",
  "white-bishop": "♗",
  "white-knight": "♘",
  "white-pawn": "♙",
  "black-king": "♚",
  "black-queen": "♛",
  "black-rook": "♜",
  "black-bishop": "♝",
  "black-knight": "♞",
  "black-pawn": "♟",
};

export default function ChessBoard({
  board,
  selectedPos,
  validMoves,
  onSquareClick,
  turn,
}: ChessBoardProps) {
  const isSelected = (r: number, c: number) =>
    selectedPos?.row === r && selectedPos?.col === c;
  const isValidMove = (r: number, c: number) =>
    validMoves.some((m) => m.row === r && m.col === c);

  return (
    <div className="chess-board">
      {board.map((row, r) => (
        <div key={r} className="board-row">
          {row.map((piece, c) => {
            const isDark = (r + c) % 2 === 1;
            const pieceKey = piece ? `${piece.color}-${piece.type}` : "";

            return (
              <div
                key={`${r}-${c}`}
                className={`square ${isDark ? "dark" : "light"} ${isSelected(r, c) ? "selected" : ""} ${isValidMove(r, c) ? "valid-move" : ""}`}
                onClick={() => onSquareClick({ row: r, col: c })}
              >
                {piece && (
                  <span className={`piece ${piece.color}`}>
                    {PIECE_SYMBOLS[pieceKey]}
                  </span>
                )}
                {/* Visual indicator for valid moves on empty squares */}
                {isValidMove(r, c) && !piece && <div className="marker" />}
                {/* Visual indicator for valid capture */}
                {isValidMove(r, c) && piece && (
                  <div className="capture-marker" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
