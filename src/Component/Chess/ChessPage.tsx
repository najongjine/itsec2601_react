import { useChessGame } from "./useChessGame";
import ChessBoard from "./ChessBoard";

export default function ChessPage() {
  const {
    board,
    turn,
    selectedPos,
    validMoves,
    status,
    winner,
    isAIMode,
    onSquareClick,
    resetGame,
    toggleAIMode,
  } = useChessGame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1>Check Game (Chess)</h1>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={toggleAIMode}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: isAIMode ? "#10b981" : "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isAIMode ? "🤖 AI Enabled" : "👤 2 Player Mode"}
        </button>
      </div>

      <div style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
        Status: <strong>{status.toUpperCase()}</strong> | Turn:{" "}
        <strong style={{ color: turn === "white" ? "orange" : "black" }}>
          {turn.toUpperCase()}
        </strong>
      </div>

      {winner && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          Winner: {winner.toUpperCase()}!
        </div>
      )}

      <ChessBoard
        board={board}
        selectedPos={selectedPos}
        validMoves={validMoves}
        onSquareClick={onSquareClick}
        turn={turn}
      />

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={resetGame}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Restart Game
        </button>
      </div>

      <div
        style={{
          marginTop: "3rem",
          maxWidth: "600px",
          textAlign: "left",
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h3>Algorithm & Logic</h3>
        <p>This game is built with a strict separation of Logic and View.</p>
        <ul>
          <li>
            <strong>Logic Layer:</strong> Pure TypeScript functions in{" "}
            <code>ChessLogic.ts</code>.
          </li>
          <li>
            <strong>AI Layer:</strong> <code>ChessAI.ts</code> contains the
            Minimax algorithm with Alpha-Beta pruning to calculate the best
            move.
          </li>
          <li>
            <strong>View Layer:</strong> React components in{" "}
            <code>ChessPage.tsx</code> and <code>ChessBoard.tsx</code> simply
            render the state.
          </li>
        </ul>
      </div>
    </div>
  );
}
