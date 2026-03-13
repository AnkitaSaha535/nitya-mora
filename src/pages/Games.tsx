import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Grid3X3, Brain, Dice5, Type, Palette, Zap, Calculator, CircleDot } from "lucide-react";

const games = [
  { id: "tictactoe", title: "Tic Tac Toe", desc: "Classic strategy game — beat the AI", icon: Grid3X3, xp: 50, color: "text-primary", glow: "glow-green" },
  { id: "memory", title: "Memory Match", desc: "Train your memory with card pairs", icon: Brain, xp: 75, color: "text-accent", glow: "glow-purple" },
  { id: "snake", title: "Snake Game", desc: "Classic snake — how long can you survive?", icon: Dice5, xp: 100, color: "text-secondary", glow: "glow-gold" },
  { id: "word-scramble", title: "Word Scramble", desc: "Unscramble the letters to find the word", icon: Type, xp: 60, color: "text-primary", glow: "glow-green" },
  { id: "color-match", title: "Color Match", desc: "Stroop test — match colors under pressure", icon: Palette, xp: 80, color: "text-accent", glow: "glow-purple" },
  { id: "reaction", title: "Reaction Time", desc: "Test your reflexes — how fast can you click?", icon: Zap, xp: 40, color: "text-secondary", glow: "glow-gold" },
  { id: "math-blitz", title: "Math Blitz", desc: "Speed math challenge — 60 seconds on the clock", icon: Calculator, xp: 90, color: "text-primary", glow: "glow-green" },
  { id: "connect-four", title: "Connect Four", desc: "Drop pieces to connect 4 in a row", icon: CircleDot, xp: 70, color: "text-accent", glow: "glow-purple" },
];

export default function Games() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Game Arena</h1>
        <p className="text-muted-foreground">Play games, train your brain, earn XP</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((game, i) => (
          <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/games/${game.id}`)}
            className={`glass p-6 cursor-pointer hover:bg-card/80 transition-all group ${game.glow}`}>
            <game.icon className={`h-8 w-8 ${game.color} mb-3`} />
            <h3 className="font-display font-bold text-foreground">{game.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{game.desc}</p>
            <p className="text-xs text-primary mt-2">+{game.xp} XP per win</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
