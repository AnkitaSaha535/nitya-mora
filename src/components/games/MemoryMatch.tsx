import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const EMOJIS = ["🌟","🔥","🎯","💎","🚀","🌈","🎸","🦊"];
interface Card { id: number; emoji: string; flipped: boolean; matched: boolean; }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function createCards(): Card[] { const pairs = shuffle(EMOJIS).slice(0,8); return shuffle([...pairs,...pairs].map((emoji,i) => ({ id: i, emoji, flipped: false, matched: false }))); }
export default function MemoryMatch() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(createCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  useEffect(() => {
    if (selected.length === 2) {
      const [a,b] = selected; setMoves(m => m+1);
      if (cards[a].emoji === cards[b].emoji) { setTimeout(() => { setCards(p => { const n = p.map((c,i) => i===a||i===b ? {...c, matched: true} : c); if (n.every(c => c.matched)) setWon(true); return n; }); setSelected([]); }, 500); }
      else { setTimeout(() => { setCards(p => p.map((c,i) => i===a||i===b ? {...c, flipped: false} : c)); setSelected([]); }, 800); }
    }
  }, [selected]);
  const handleClick = (i: number) => { if (selected.length >= 2 || cards[i].flipped || cards[i].matched) return; setCards(p => p.map((c,idx) => idx===i ? {...c, flipped: true} : c)); setSelected(p => [...p, i]); };
  const reset = () => { setCards(createCards()); setSelected([]); setMoves(0); setWon(false); };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground text-center">Memory Match</h1>
      <p className="text-center text-muted-foreground">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <motion.button key={card.id} whileTap={{ scale: 0.95 }} onClick={() => handleClick(i)}
            className={`aspect-square glass text-2xl flex items-center justify-center transition-all ${card.matched ? "glow-green" : ""}`}>
            {card.flipped || card.matched ? card.emoji : "?"}
          </motion.button>
        ))}
      </div>
      {won && <div className="text-center space-y-2">
        <p className="text-xl font-display font-bold text-primary">You win! +75 XP 🎉</p>
        <p className="text-muted-foreground">Completed in {moves} moves</p>
        <Button onClick={reset}><RotateCcw className="h-4 w-4 mr-2" /> Play Again</Button>
      </div>}
    </motion.div>
  );
}
