# ⚡ React Tic-Tac-Toe Lab

> Classic Tic-Tac-Toe built following the [official React tutorial](https://react.dev/learn/tutorial-tic-tac-toe), with a deep dive into **State**, **Props**, and **Immutability**.

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 🔗 Live Demo

<!-- Replace with your deployed URL -->
**[▶ Play Live →](https://your-app.vercel.app)**

---

## 🏗️ Architecture Patterns

### 1. State — Single Source of Truth

All game data lives in the top-level `Game` component:

```jsx
const [history, setHistory] = useState([Array(9).fill(null)]);
const [currentMove, setCurrentMove] = useState(0);
```

`history` is an **array of board snapshots** — each element is a 9-slot array representing one move. This is what enables time travel.

**Why centralize state?** If `Board` or `Square` each held their own state, syncing them would require complex event chains. By lifting state up to the nearest common ancestor (`Game`), all components stay consistent.

---

### 2. Props — Unidirectional Data Flow

```
Game (state owner)
  └── Board  ← receives: xIsNext, squares, onPlay
        └── Square  ← receives: value, onSquareClick, isWinning
```

Data flows **down** via props. Events flow **up** via callback props (`onPlay`, `onSquareClick`). `Square` is a **pure presentational component** — it renders exactly what it receives, nothing more.

```jsx
// Square never mutates — it only calls back
function Square({ value, onSquareClick, isWinning }) {
  return (
    <button className={...} onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

---

### 3. Immutability — Why We Never Mutate

In `Board.handleClick`, we create a **copy** of the squares array rather than mutating it:

```jsx
function handleClick(i) {
  const nextSquares = squares.slice(); // ← shallow copy
  nextSquares[i] = xIsNext ? "X" : "O";
  onPlay(nextSquares); // pass new array up
}
```

**Benefits of immutability:**
| Benefit | Explanation |
|---|---|
| Time Travel | Old snapshots are preserved untouched in `history` |
| Change Detection | React compares object references — new array = guaranteed re-render |
| Undo/Redo for free | Any past snapshot can be restored with `setCurrentMove(n)` |
| Predictability | State never changes underneath you; functions are pure |

---

### 4. Time Travel — History as Derived State

```jsx
// Jump to any past board state
function jumpTo(move) {
  setCurrentMove(move);
}

// Current board is always derived, never stored separately
const currentSquares = history[currentMove];
```

Because every `handleClick` produces a **new snapshot** appended to `history`, we never lose past states. This is a direct consequence of immutability.

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/react-tictactoe-lab.git
cd react-tictactoe-lab

# 2. Install
npm install

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build
```

---

## 📦 Deploying

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new) — zero config needed for Vite projects.

### Netlify

```bash
npm run build
# drag-drop the /dist folder to netlify.com/drop
```

Or add a `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

---

## 🗂️ Project Structure

```
react-tictactoe-lab/
├── src/
│   ├── App.jsx       # Game, Board, Square components + calculateWinner
│   ├── index.css     # All styles (design tokens, board, animations)
│   └── main.jsx      # React DOM entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 📖 Key Concepts Reference

| Concept | Where | Code Pattern |
|---|---|---|
| State (useState) | `Game` | `const [history, setHistory] = useState(...)` |
| Lifting State Up | `Board → Game` | `onPlay` callback prop |
| Immutability | `Board.handleClick` | `squares.slice()` |
| Derived State | `Game` | `history[currentMove]` |
| Pure Component | `Square` | No hooks, props-only |
| Conditional Rendering | `Board` | `winner ?` ternary |

---

## License

MIT
