import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const GRID = 20; const CELL = 16;
type Point = { x: number; y: number }; type Dir = "UP"|"DOWN"|"LEFT"|"RIGHT";
function randomFood(snake: Point[]): Point { let p: Point; do { p = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) }; } while (snake.some(s => s.x===p.x && s.y===p.y)); return p; }
export default function SnakeGame() {
  const navigate = useNavigate();
  const [snake, setSnake] = useState<Point[]>([{x:10,y:10}]);
  const [food, setFood] = useState<Point>({x:5,y:5});
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef(dir); dirRef.current = dir;
  const reset = () => { const s = [{x:10,y:10}]; setSnake(s); setFood(randomFood(s)); setDir("RIGHT"); setGameOver(false); setStarted(false); setScore(0); };
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { const map: Record<string,Dir> = {ArrowUp:"UP",ArrowDown:"DOWN",ArrowLeft:"LEFT",ArrowRight:"RIGHT"}; const d = map[e.key]; if (!d) return; e.preventDefault(); const opp: Record<Dir,Dir> = {UP:"DOWN",DOWN:"UP",LEFT:"RIGHT",RIGHT:"LEFT"}; if (d !== opp[dirRef.current]) setDir(d); if (!started) setStarted(true); };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, [started]);
  useEffect(() => {
    if (!started || gameOver) return;
    const timer = setInterval(() => {
      setSnake(prev => {
        const head = {...prev[0]}; const d = dirRef.current;
        if (d==="UP") head.y--; else if (d==="DOWN") head.y++; else if (d==="LEFT") head.x--; else head.x++;
        if (head.x<0||head.x>=GRID||head.y<0||head.y>=GRID||prev.some(s=>s.x===head.x&&s.y===head.y)) { setGameOver(true); return prev; }
        const ns = [head,...prev];
        if (head.x===food.x&&head.y===food.y) { setScore(s=>s+10); setFood(randomFood(ns)); } else { ns.pop(); }
        return ns;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [started, gameOver, food]);
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-4">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground text-center">Snake Game</h1>
      <p className="text-center text-muted-foreground">Score: {score}</p>
      <div className="mx-auto border border-glass-border rounded-lg overflow-hidden" style={{width:GRID*CELL,height:GRID*CELL,position:"relative",background:"hsl(var(--card))"}}>
        {snake.map((s,i) => <div key={i} style={{position:"absolute",left:s.x*CELL,top:s.y*CELL,width:CELL,height:CELL,background:i===0?"hsl(var(--primary))":"hsl(var(--primary)/0.6)",borderRadius:2}} />)}
        <div style={{position:"absolute",left:food.x*CELL,top:food.y*CELL,width:CELL,height:CELL,background:"hsl(var(--secondary))",borderRadius:"50%"}} />
      </div>
      {!started && !gameOver && <p className="text-center text-muted-foreground">Press arrow keys to start</p>}
      {gameOver && <div className="text-center space-y-2"><p className="text-xl font-display font-bold text-destructive">Game Over! Score: {score}</p><Button onClick={reset}><Play className="h-4 w-4 mr-2" /> Play Again</Button></div>}
    </div>
  );
}
