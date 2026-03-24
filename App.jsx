import { useState } from "react";
import "./index.css";

// ─────────────────────────────────────────────
// Square — pure presentational component
// Receives value & onClick via props (no state)
// ─────────────────────────────────────────────
function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${value ? "square--filled" : ""} ${isWinning ? "square--winning" : ""}`}
      onClick={onSquareClick}
    >
      <span className={`square__symbol ${value === "X" ? "sym-x" : value === "O" ? "sym-o" : ""}`}>
        {value}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// Board — renders 3×3 grid, lifts state to Game
// ─────────────────────────────────────────────
function Board({ xIsNext, squares, onPlay }) {
  const winInfo = calculateWinner(squares);
  const winner = winInfo?.winner;
  const winLine = winInfo?.line ?? [];

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice(); // immutable copy
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const isDraw = !winner && squares.every(Boolean);
  let statusText, statusClass;
  if (winner) {
    statusText = `Player ${winner} wins!`;
    statusClass = "status--winner";
  } else if (isDraw) {
    statusText = "It's a draw!";
    statusClass = "status--draw";
  } else {
    statusText = `Player ${xIsNext ? "X" : "O"}'s turn`;
    statusClass = xIsNext ? "status--x" : "status--o";
  }

  return (
    <div className="board-container">
      <div className={`status ${statusClass}`}>
        <span className="status__indicator" />
        {statusText}
      </div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board__row">
            {[0, 1, 2].map((col) => {
              const idx = row * 3 + col;
              return (
                <Square
                  key={idx}
                  value={squares[idx]}
                  onSquareClick={() => handleClick(idx)}
                  isWinning={winLine.includes(idx)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Game — top-level state owner (history array)
// Demonstrates immutability + time-travel
// ─────────────────────────────────────────────
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((_, move) => {
    const isActive = move === currentMove;
    const label = move === 0 ? "Start" : `Move #${move}`;
    return (
      <li key={move}>
        <button
          className={`history-btn ${isActive ? "history-btn--active" : ""}`}
          onClick={() => jumpTo(move)}
        >
          <span className="history-btn__dot" />
          {label}
        </button>
      </li>
    );
  });

  return (
    <div className="app">
      {/* Decorative grid background */}
      <div className="bg-grid" aria-hidden="true" />

      <header className="header">
        <div className="header__logo">
          <span className="logo-x">X</span>
          <span className="logo-sep">·</span>
          <span className="logo-o">O</span>
        </div>
        <h1 className="header__title">Tic-Tac-Toe</h1>
        <p className="header__sub">React State · Props · Immutability</p>
      </header>

      <main className="game">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

        <aside className="sidebar">
          <div className="sidebar__actions">
            <button className="btn btn--reset" onClick={resetGame}>
              New Game
            </button>
            <button
              className="btn btn--history"
              onClick={() => setShowHistory((s) => !s)}
            >
              {showHistory ? "Hide" : "Show"} History
            </button>
          </div>

          {showHistory && (
            <div className="history">
              <h2 className="history__title">Time Travel</h2>
              <ol className="history__list">{moves}</ol>
            </div>
          )}

          <div className="legend">
            <h2 className="legend__title">Architecture Notes</h2>
            <ul className="legend__list">
              <li>
                <strong>State</strong> lives in <code>Game</code>
              </li>
              <li>
                <strong>Props</strong> flow down to <code>Board</code> → <code>Square</code>
              </li>
              <li>
                <strong>Immutability</strong> via <code>squares.slice()</code>
              </li>
              <li>
                <strong>Time Travel</strong> preserves full history array
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Pure helper — no side effects
// ─────────────────────────────────────────────
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
