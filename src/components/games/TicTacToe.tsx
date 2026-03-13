import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Cell = "X" | "O" | null;
type Winner = "X" | "O" | "draw" | null;
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function checkWinner(board: Cell[]): Winner {
  for (const [a,b,c] of LINES) { if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]; }
  if (board.every(c => c)) return "draw";
  return null;
}
function aiMove(board: Cell[]): number {
  for (let i = 0; i < 9; i++) { if (!board[i]) { const t = [...board]; t[i] = "O"; if (checkWinner(t) === "O") return i; } }
  for (let i = 0; i < 9; i++) { if (!board[i]) { const t = [...board]; t[i] = "X"; if (checkWinner(t) === "X") return i; } }
  if (!board[4]) return 4;
  const c = [0,2,6,8].filter(i => !board[i]); if (c.length) return c[Math.floor(Math.random()*c.length)];
  const e = [1,3,5,7].filter(i => !board[i]); return e[Math.floor(Math.random()*e.length)];
}
export default function TicTacToe() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<Winner>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const handleClick = useCallback((i: number) => {
    if (board[i] || winner) return;
    const nb = [...board]; nb[i] = "X";
    const w = checkWinner(nb);
    if (w) { setBoard(nb); setWinner(w); if (w === "X") setScore(s => ({...s, wins: s.wins+1})); else if (w === "draw") setScore(s => ({...s, draws: s.draws+1})); return; }
    const ai = aiMove(nb); nb[ai] = "O";
    const w2 = checkWinner(nb);
    setBoard(nb);
    if (w2) { setWinner(w2); if (w2 === "O") setScore(s => ({...s, losses: s.losses+1})); else if (w2 === "draw") setScore(s => ({...s, draws: s.draws+1})); }
  }, [board, winner]);
  const reset = () => { setBoard(Array(9).fill(null)); setWinner(null); };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground text-center">Tic Tac Toe</h1>
      <p className="text-center text-muted-foreground">W:{score.wins} L:{score.losses} D:{score.draws}</p>
      <div className="grid grid-cols-3 gap-2 max-w-[300px] mx-auto">
        {board.map((cell, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => handleClick(i)}
            className={`aspect-square glass text-3xl font-display font-bold flex items-center justify-center ${cell === "X" ? "text-primary" : "text-accent"}`}>
            {cell}
          </motion.button>
        ))}
      </div>
      {winner && <div className="text-center space-y-2">
        <p className="text-xl font-display font-bold text-foreground">{winner === "draw" ? "Draw!" : winner === "X" ? "You win! +50 XP" : "AI wins!"}</p>
        <Button onClick={reset}><RotateCcw className="h-4 w-4 mr-2" /> Play Again</Button>
      </div>}
    </motion.div>
  );
}
