import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const OPS = ["+","-","×"] as const;
function gen() { const op = OPS[Math.floor(Math.random()*OPS.length)]; let a:number,b:number,answer:number; switch(op){case"+":a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;answer=a+b;break;case"-":a=Math.floor(Math.random()*50)+10;b=Math.floor(Math.random()*a);answer=a-b;break;case"×":a=Math.floor(Math.random()*12)+2;b=Math.floor(Math.random()*12)+2;answer=a*b;break;} const opts = new Set([answer!]); while(opts.size<4) opts.add(answer!+Math.floor(Math.random()*20)-10||answer!+1); return {a:a!,b:b!,op,answer:answer!,options:[...opts].sort(()=>Math.random()-0.5)}; }
export default function MathBlitz() {
  const navigate = useNavigate();
  const [score,setScore]=useState(0);const [timeLeft,setTimeLeft]=useState(60);const [gameActive,setGameActive]=useState(false);const [problem,setProblem]=useState(gen());const [feedback,setFeedback]=useState("");
  const startGame=()=>{setScore(0);setTimeLeft(60);setGameActive(true);setProblem(gen());};
  useEffect(()=>{if(!gameActive)return;const t=setInterval(()=>{setTimeLeft(v=>{if(v<=1){setGameActive(false);clearInterval(t);return 0;}return v-1;});},1000);return()=>clearInterval(t);},[gameActive]);
  const handleAnswer=(n:number)=>{if(!gameActive)return;if(n===problem.answer){setScore(s=>s+10);setFeedback("✓");}else{setFeedback("✗");}setTimeout(()=>{setProblem(gen());setFeedback("");},500);};
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-6 text-center">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground">Math Blitz</h1>
      <p className="text-muted-foreground">Score: {score} | Time: {timeLeft}s</p>
      {!gameActive?<Button onClick={startGame} className="bg-primary text-primary-foreground">{timeLeft===0?"Play Again":"Start Game"}</Button>:(
        <div className="space-y-6">
          <p className="text-4xl font-display font-bold text-foreground">{problem.a} {problem.op} {problem.b} = ?</p>
          <div className="grid grid-cols-2 gap-3">{problem.options.map(o=><Button key={o} onClick={()=>handleAnswer(o)} variant="outline" className="text-lg font-display">{o}</Button>)}</div>
          {feedback&&<p className={`text-3xl ${feedback==="✓"?"text-primary":"text-destructive"}`}>{feedback}</p>}
        </div>
      )}
    </div>
  );
}
