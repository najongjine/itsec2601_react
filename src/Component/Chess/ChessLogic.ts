import {
  BoardState,
  Piece,
  PieceType,
  PlayerColor,
  Position,
} from "./ChessTypes";

export const BOARD_SIZE = 8;

// --- Helper Functions ---

export function getInitialBoard(): BoardState {
  const board: BoardState = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  const setupRow = (row: number, color: PlayerColor) => {
    const types: PieceType[] = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];
    types.forEach((type, col) => {
      board[row][col] = { type, color };
    });
  };

  const setupPawns = (row: number, color: PlayerColor) => {
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = { type: "pawn", color };
    }
  };

  setupRow(0, "black");
  setupPawns(1, "black");
  setupPawns(6, "white");
  setupRow(7, "white");

  return board;
}

function isValidPos(pos: Position): boolean {
  return (
    pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE
  );
}

function isOpponent(
  board: BoardState,
  pos: Position,
  color: PlayerColor,
): boolean {
  const piece = board[pos.row][pos.col];
  return piece !== null && piece.color !== color;
}

function isEmpty(board: BoardState, pos: Position): boolean {
  return board[pos.row][pos.col] === null;
}

// --- Move Logic specific to each piece ---

function getPawnMoves(
  board: BoardState,
  pos: Position,
  color: PlayerColor,
): Position[] {
  const moves: Position[] = [];
  const direction = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;

  // Move forward 1
  const forward1 = { row: pos.row + direction, col: pos.col };
  if (isValidPos(forward1) && isEmpty(board, forward1)) {
    moves.push(forward1);
    // Move forward 2 (only if starting and path clear)
    const forward2 = { row: pos.row + direction * 2, col: pos.col };
    if (pos.row === startRow && isEmpty(board, forward2)) {
      moves.push(forward2);
    }
  }

  // Capture diagonal
  const captureOffsets = [-1, 1];
  for (const offset of captureOffsets) {
    const target = { row: pos.row + direction, col: pos.col + offset };
    if (isValidPos(target) && isOpponent(board, target, color)) {
      moves.push(target);
    }
  }

  return moves;
}

function getSlidingMoves(
  board: BoardState,
  pos: Position,
  directions: number[][],
  color: PlayerColor,
): Position[] {
  const moves: Position[] = [];
  for (const [dRow, dCol] of directions) {
    let r = pos.row + dRow;
    let c = pos.col + dCol;
    while (isValidPos({ row: r, col: c })) {
      if (isEmpty(board, { row: r, col: c })) {
        moves.push({ row: r, col: c });
      } else {
        if (isOpponent(board, { row: r, col: c }, color)) {
          moves.push({ row: r, col: c });
        }
        break; // Blocked by piece
      }
      r += dRow;
      c += dCol;
    }
  }
  return moves;
}

function getKnightMoves(
  board: BoardState,
  pos: Position,
  color: PlayerColor,
): Position[] {
  const offsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];
  const moves: Position[] = [];
  for (const [dr, dc] of offsets) {
    const target = { row: pos.row + dr, col: pos.col + dc };
    if (isValidPos(target)) {
      if (isEmpty(board, target) || isOpponent(board, target, color)) {
        moves.push(target);
      }
    }
  }
  return moves;
}

function getKingMoves(
  board: BoardState,
  pos: Position,
  color: PlayerColor,
): Position[] {
  const moves: Position[] = [];
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const target = { row: pos.row + r, col: pos.col + c };
      if (isValidPos(target)) {
        if (isEmpty(board, target) || isOpponent(board, target, color)) {
          moves.push(target);
        }
      }
    }
  }
  return moves;
}

// --- Main Move Calculator ---

export function getPotentialMoves(
  board: BoardState,
  pos: Position,
): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const { type, color } = piece;

  switch (type) {
    case "pawn":
      return getPawnMoves(board, pos, color);
    case "rook":
      return getSlidingMoves(
        board,
        pos,
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ],
        color,
      );
    case "bishop":
      return getSlidingMoves(
        board,
        pos,
        [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ],
        color,
      );
    case "queen":
      return getSlidingMoves(
        board,
        pos,
        [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ],
        color,
      );
    case "knight":
      return getKnightMoves(board, pos, color);
    case "king":
      return getKingMoves(board, pos, color);
    default:
      return [];
  }
}

// --- Check and Validation Logic ---

export function findKing(
  board: BoardState,
  color: PlayerColor,
): Position | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.type === "king" && p.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

// Is the 'color' King under attack?
export function isCheck(board: BoardState, color: PlayerColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false; // Should not happen in normal game

  const opponentColor = color === "white" ? "black" : "white";

  // Naive check: Go through all opponent pieces and see if they can hit the king
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === opponentColor) {
        const moves = getPotentialMoves(board, { row: r, col: c });
        if (moves.some((m) => m.row === kingPos.row && m.col === kingPos.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Simulate move to see if it results in self-check
function isMoveSafe(
  board: BoardState,
  from: Position,
  to: Position,
  color: PlayerColor,
): boolean {
  // Create temp board
  const newBoard = board.map((row) => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;

  return !isCheck(newBoard, color);
}

export function getValidMoves(board: BoardState, pos: Position): Position[] {
  const potentialMoves = getPotentialMoves(board, pos);
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  return potentialMoves.filter((to) => isMoveSafe(board, pos, to, piece.color));
}

export function isCheckmate(board: BoardState, color: PlayerColor): boolean {
  if (!isCheck(board, color)) return false;

  // Try all possible moves for current player
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row: r, col: c });
        if (moves.length > 0) return false; // Found a way out
      }
    }
  }
  return true;
}
