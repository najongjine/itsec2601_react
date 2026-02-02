import { BoardState, Piece, PlayerColor, Position } from "./ChessTypes";
import {
  getValidMoves,
  getPotentialMoves,
  BOARD_SIZE,
  isCheck,
  isCheckmate,
} from "./ChessLogic";

// --- Heuristic Evaluation ---

const PIECE_VALUES: Record<string, number> = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900,
};

// Evaluate board from the perspective of 'color'
// Positive score = advantage for 'color'
// Negative score = disadvantage for 'color'
export function evaluateBoard(board: BoardState, color: PlayerColor): number {
  let score = 0;
  const opponent = color === "white" ? "black" : "white";

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        if (piece.color === color) {
          score += val;
        } else {
          score -= val;
        }
      }
    }
  }

  // Slight positional bonus for controlling center (simplified)
  // ... can be added here for smarter AI ...

  return score;
}

// --- Minimax Algorithm ---

interface Move {
  from: Position;
  to: Position;
  score?: number;
}

// Get all possible moves for a player
function getAllMoves(board: BoardState, color: PlayerColor): Move[] {
  const moves: Move[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const validEnds = getValidMoves(board, { row: r, col: c });
        for (const end of validEnds) {
          moves.push({ from: { row: r, col: c }, to: end });
        }
      }
    }
  }
  return moves;
}

// Clone board helper
function cloneBoard(board: BoardState): BoardState {
  return board.map((row) => [...row]);
}

// Execute move on a cloned board
function makeMove(board: BoardState, move: Move): BoardState {
  const newBoard = cloneBoard(board);
  newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
  newBoard[move.from.row][move.from.col] = null;
  return newBoard;
}

export function getBestMove(
  board: BoardState,
  color: PlayerColor,
  depth: number = 3,
): Move | null {
  // If we are looking for the best move for 'color', we want to Maximize the score for 'color'.
  // We pass 'true' for isMaximizing.
  const { move } = minimax(board, depth, true, color, -Infinity, Infinity);
  return move || null;
}

// Minimax with Alpha-Beta Pruning
// isMaximizing = true means we are 'me' (the AI player) trying to get max score
// isMaximizing = false means we are 'opponent' trying to minimize 'me's score
function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  playerColor: PlayerColor,
  alpha: number,
  beta: number,
): { score: number; move?: Move } {
  // Base case: Terminate at depth 0 or checkmate
  if (depth === 0) {
    return { score: evaluateBoard(board, playerColor) };
  }

  // Determine whose turn it is in the simulation
  const contentColor = isMaximizing
    ? playerColor
    : playerColor === "white"
      ? "black"
      : "white";
  const allMoves = getAllMoves(board, contentColor);

  // If no moves, check for checkmate or stalemate
  if (allMoves.length === 0) {
    if (isCheck(board, contentColor)) {
      // Checkmate is very bad for current player
      return { score: isMaximizing ? -10000 : 10000 };
    } else {
      // Stalemate is neutral
      return { score: 0 };
    }
  }

  let bestMove: Move | undefined = undefined;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of allMoves) {
      const nextBoard = makeMove(board, move);
      const evaluation = minimax(
        nextBoard,
        depth - 1,
        false,
        playerColor,
        alpha,
        beta,
      ).score;
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Prune
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const move of allMoves) {
      const nextBoard = makeMove(board, move);
      // Pass playerColor unchanged because evaluateBoard is always relative to playerColor
      const evaluation = minimax(
        nextBoard,
        depth - 1,
        true,
        playerColor,
        alpha,
        beta,
      ).score;
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Prune
    }
    return { score: minEval, move: bestMove };
  }
}
