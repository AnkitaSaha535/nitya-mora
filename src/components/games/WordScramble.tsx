import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const WORDS = ["REACT","VITE","NODE","CODE","LOOP","BYTE","DATA","GRID","HASH","LINK","MATH","SORT","TREE","TYPE","VOID","UNIX"];
export default function WordScramble() {
  const navigate = useNavigate();
  const [word, setWord] = useState(""); const [scrambled, setScrambled] = useState(""); const [guess, setGuess] = useState(""); const [score, setScore] = useState(0); const [message, setMessage] = useState(""); const [round, setRound] = useState(0);
  const newWord = useCallback(() => { const w = WORDS[Math.floor(Math.random()*WORDS.length)]; setWord(w); setScrambled(w.split("").sort(()=>Math.random()-0.5).join("")); setGuess(""); setMessage(""); setRound(r=>r+1); }, []);
  useEffect(() => { newWord(); }, [newWord]);
  const handleSubmit = () => { if (guess.toUpperCase()===word) { setScore(s=>s+10); setMessage("🎉 Correct!"); setTimeout(newWord, 1000); } else { setMessage("❌ Try again!"); } };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-lg mx-auto space-y-6 text-center">
      <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      <h1 className="text-3xl font-display font-bold text-foreground">Word Scramble</h1>
      <p className="text-muted-foreground">Score: {score} | Round: {round}</p>
      <div className="text-5xl font-display font-bold text-primary tracking-widest">{scrambled}</div>
      <input value={guess} onChange={e=>setGuess(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
        className="w-full max-w-xs mx-auto bg-muted/30 rounded-lg p-3 text-center text-xl font-display text-foreground tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your guess..." maxLength={word.length} />
      <div className="flex justify-center gap-3">
        <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">Submit</Button>
        <Button variant="ghost" onClick={newWord}>Skip</Button>
      </div>
      {message && <p className="text-lg font-display">{message}</p>}
    </motion.div>
  );
}
