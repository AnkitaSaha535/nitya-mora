import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const COLORS = [{ name: "RED", color: "text-red-500" },{ name: "BLUE", color: "text-blue-500" },{ name: "GREEN", color: "text-green-500" },{ name: "YELLOW", color: "text-yellow-400" },{ name: "PURPLE", color: "text-purple-500" },{ name: "ORANGE", color: "text-orange-500" }];
function getRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }
export default function ColorMatch() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0); const [timeLeft, setTimeLeft] = useState(30); const [gameActive, setGameActive] = useState(false);
  const [displayWord, setDisplayWord] = useState(COLORS[0]); const [displayColor, setDisplayColor] = useState(COLORS[1]); const [message, setMessage] = useState("Match the COLOR of the text, not the word!");
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const newRound = useCallback(() => { setDisplayWord(getRandom(COLORS)); setDisplayColor(getRandom(COLORS)); }, []);
  const startGame = () => { setScore(0); setTimeLeft(30); setGameActive(true); setMessage(""); newRound(); };
  useEffect(() => { if (!gameActive) return; timerRef.current = setInterval(() => { setTimeLeft(t => { if (t<=1) { setGameActive(false); clearInterval(timerRef.current); setMessage(`Time's up! Score: ${score}`); return 0; } return t-1; }); }, 1000); return () => clearInterval(timerRef.current); }, [gameActive, score]);
  const handleAnswer = (colorName: string) => { if (!gameActive) return; if (colorName === displayColor.name) { setScore(s=>s+1); } newRound(); };
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground text-center">Color Match</h1>
      <p className="text-center text-muted-foreground">Score: {score} | Time: {timeLeft}s</p>
      {!gameActive ? <div className="text-center"><Button onClick={startGame} className="bg-primary text-primary-foreground">{timeLeft===0?"Play Again":"Start Game"}</Button><p className="mt-2 text-sm text-muted-foreground">{message}</p></div> : (
        <div className="text-center space-y-6">
          <p className={`text-6xl font-display font-bold ${displayColor.color}`}>{displayWord.name}</p>
          <div className="grid grid-cols-3 gap-2">{COLORS.map(c => <Button key={c.name} onClick={() => handleAnswer(c.name)} variant="outline" className={c.color}>{c.name}</Button>)}</div>
        </div>
      )}
    </div>
  );
}
