import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabits } from "@/context/HabitContext";
import { Plus, Trash2, CheckCircle2, Circle, Sparkles, Settings2, Camera, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProofOfWorkModal from "@/components/ProofOfWorkModal";

export default function Habits() {
  const { todayEntry, habitSchema, toggleHabit, addCustomHabit, removeCustomHabit, proofs, setHabitRequiresProof } = useHabits();
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newXP, setNewXP] = useState(50);
  const [proofModalHabit, setProofModalHabit] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const totalHabits = Object.keys(habitSchema).length;
  const completedToday = todayEntry ? Object.entries(todayEntry.habits).filter(([k, v]) => v && habitSchema[k]).length : 0;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const getProofStatus = (habitKey: string) => {
    const proof = proofs.find(p => p.habitKey === habitKey && p.timestamp.split("T")[0] === today);
    return proof?.status || null;
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const key = newLabel.trim().toLowerCase().replace(/\s+/g, "_");
    addCustomHabit(key, newLabel.trim(), newXP);
    setNewLabel("");
    setNewXP(50);
    setShowAdd(false);
  };

  const handleHabitClick = (key: string) => {
    const schema = habitSchema[key];
    const done = todayEntry?.habits[key] ?? false;
    if (done) return;
    if (schema.requiresProof) {
      setProofModalHabit(key);
    } else {
      toggleHabit(key);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Habit Manager</h1>
        <p className="text-muted-foreground">Track, manage, and prove your daily quests</p>
      </div>

      <div className="glass p-4 space-y-3">
        <h2 className="font-display font-bold text-foreground">Today's Progress</h2>
        <Progress value={completionRate} className="h-3" />
        <p className="text-sm text-muted-foreground">{completedToday}/{totalHabits} · {completionRate}% complete · {todayEntry?.xpEarned || 0} XP earned today</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-display font-bold text-foreground">Daily Checklist</h2>
        {Object.entries(habitSchema).map(([key, schema], i) => {
          const done = todayEntry?.habits[key] ?? false;
          const proofStatus = getProofStatus(key);
          const requiresProof = schema.requiresProof;

          return (
            <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => handleHabitClick(key)}
              className={`glass p-4 flex items-center gap-4 cursor-pointer transition-all ${done ? "glow-green border-primary/40" : "hover:bg-muted/30"}`}>
              {done ? <CheckCircle2 className="h-6 w-6 text-primary" /> : requiresProof ? <Camera className="h-6 w-6 text-proof-primary" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
              <div className="flex-1">
                <p className={`font-medium ${done ? "text-primary" : "text-foreground"}`}>{schema.label}</p>
                <p className="text-xs text-muted-foreground">+{schema.xp} XP</p>
              </div>
              {proofStatus === "verified" && <span className="text-xs bg-verified/20 text-verified px-2 py-1 rounded-full">Verified</span>}
              {proofStatus === "rejected" && <span className="text-xs bg-rejected/20 text-rejected px-2 py-1 rounded-full">Rejected</span>}
              {!done && requiresProof && !proofStatus && <span className="text-xs text-proof-primary">Upload proof</span>}

              <button onClick={(e) => { e.stopPropagation(); setHabitRequiresProof(key, !requiresProof); }}
                className={`p-1.5 rounded-lg transition-colors ${requiresProof ? "text-proof-primary hover:bg-proof-primary/10" : "text-muted-foreground hover:bg-muted/30"}`}
                title={requiresProof ? "Proof required (click to disable)" : "No proof required (click to enable)"}>
                {requiresProof ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); removeCustomHabit(key); }}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Remove habit">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass p-4 space-y-3">
            <h3 className="font-display font-semibold text-foreground">New Habit</h3>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Habit name (e.g. Water Intake)"
              className="w-full bg-muted/30 rounded-lg p-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">XP Reward:</span>
              <input type="number" value={newXP} onChange={e => setNewXP(Number(e.target.value))}
                className="w-20 bg-muted/30 rounded-lg p-2 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/30" min={10} max={200} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Habit</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showAdd && (
        <Button onClick={() => setShowAdd(true)} variant="outline" className="w-full mt-4 border-dashed border-muted-foreground/30 hover:border-primary/50">
          <Plus className="h-4 w-4 mr-1" /> Add New Habit
        </Button>
      )}

      <AnimatePresence>
        {proofModalHabit && (
          <ProofOfWorkModal habitKey={proofModalHabit} habitLabel={habitSchema[proofModalHabit]?.label || ""} onClose={() => setProofModalHabit(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
