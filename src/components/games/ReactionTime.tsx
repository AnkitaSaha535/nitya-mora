import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
export default function ReactionTime() {
  const navigate = useNavigate();
  const [state, setState] = useState<"waiting"|"ready"|"go"|"result"|"early">("waiting");
  const [startTime, setStartTime] = useState(0); const [reactionTime, setReactionTime] = useState(0); const [best, setBest] = useState(Infinity);
  useEffect(() => { if (state==="ready") { const delay = 1500+Math.random()*3500; const timer = setTimeout(() => { setState("go"); setStartTime(Date.now()); }, delay); return () => clearTimeout(timer); } }, [state]);
  const handleClick = () => {
    if (state==="waiting") setState("ready");
    else if (state==="ready") setState("early");
    else if (state==="go") { const rt = Date.now()-startTime; setReactionTime(rt); if (rt<best) setBest(rt); setState("result"); }
    else setState("ready");
  };
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground text-center">Reaction Time</h1>
      <div onClick={handleClick} className={`rounded-xl p-16 text-center cursor-pointer transition-colors ${state==="go"?"bg-primary":"bg-muted"}`}>
        {state==="waiting"&&<p className="text-xl text-foreground font-display">Click to start</p>}
        {state==="ready"&&<p className="text-xl text-secondary font-display">Wait for green...</p>}
        {state==="go"&&<p className="text-xl text-primary-foreground font-display font-bold">CLICK NOW!</p>}
        {state==="result"&&<><p className="text-4xl font-display font-bold text-foreground">{reactionTime}ms</p><p className="text-muted-foreground mt-2">Best: {best===Infinity?"—":`${best}ms`}</p><p className="text-sm text-muted-foreground mt-4">Click to retry</p></>}
        {state==="early"&&<p className="text-xl text-destructive font-display">Too early! Click to retry</p>}
      </div>
    </div>
  );
}
