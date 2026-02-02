import { useState, useEffect, useCallback } from "react";
import { BoardState, PlayerColor, Position, Piece } from "./ChessTypes";
import * as ChessLogic from "./ChessLogic";

export interface GameState {
  board: BoardState;
  turn: PlayerColor;
  selectedPos: Position | null;
  validMoves: Position[];
  status: "playing" | "check" | "checkmate";
  winner: PlayerColor | null;
}

export function useChessGame() {
  const [board, setBoard] = useState<BoardState>(ChessLogic.getInitialBoard());
  const [turn, setTurn] = useState<PlayerColor>("white");
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [status, setStatus] = useState<"playing" | "check" | "checkmate">(
    "playing",
  );
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  useEffect(() => {
    // Check game status on turn change
    if (ChessLogic.isCheckmate(board, turn)) {
      setStatus("checkmate");
      setWinner(turn === "white" ? "black" : "white");
    } else if (ChessLogic.isCheck(board, turn)) {
      setStatus("check");
    } else {
      setStatus("playing");
    }
  }, [board, turn]);

  const onSquareClick = useCallback(
    (pos: Position) => {
      if (status === "checkmate") return;

      const clickedPiece = board[pos.row][pos.col];
      const isSamePos =
        selectedPos &&
        selectedPos.row === pos.row &&
        selectedPos.col === pos.col;

      // 1. Deselect if clicking same square
      if (isSamePos) {
        setSelectedPos(null);
        setValidMoves([]);
        return;
      }

      // 2. Select own piece
      if (clickedPiece && clickedPiece.color === turn) {
        setSelectedPos(pos);
        setValidMoves(ChessLogic.getValidMoves(board, pos));
        return;
      }

      // 3. Move if valid
      if (selectedPos) {
        const isMoveValid = validMoves.some(
          (m) => m.row === pos.row && m.col === pos.col,
        );
        if (isMoveValid) {
          // Execute Move
          const newBoard = board.map((row) => [...row]);
          newBoard[pos.row][pos.col] =
            newBoard[selectedPos.row][selectedPos.col];
          newBoard[selectedPos.row][selectedPos.col] = null;

          setBoard(newBoard);
          setTurn(turn === "white" ? "black" : "white");
          setSelectedPos(null);
          setValidMoves([]);
        } else {
          // Clicked invalid empty square or opponent piece (not capture) -> Deselect
          // Actually, if it was a capture it would be in validMoves.
          // So just deselect.
          setSelectedPos(null);
          setValidMoves([]);
        }
      }
    },
    [board, turn, selectedPos, validMoves, status],
  );

  const resetGame = useCallback(() => {
    setBoard(ChessLogic.getInitialBoard());
    setTurn("white");
    setStatus("playing");
    setWinner(null);
    setSelectedPos(null);
    setValidMoves([]);
  }, []);

  return {
    board,
    turn,
    selectedPos,
    validMoves,
    status,
    winner,
    onSquareClick,
    resetGame,
  };
}
