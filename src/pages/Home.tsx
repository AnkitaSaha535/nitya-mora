import { motion } from "framer-motion";
import { useHabits } from "@/context/HabitContext";
import { useHaiku } from "@/context/HaikuContext";
import { getStreakStage } from "@/utils/streakLogic";
import { BookOpen, Dumbbell, Brain, Flame, Trophy, Star, Zap, TrendingUp, Camera, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const iconMap: Record<string, any> = { BookOpen, Dumbbell, Brain };

export default function Home() {
  const { todayEntry, currentStreak, longestStreak, totalXP, level, currentLevelXP, nextLevelXP, habitSchema, toggleHabit, proofs } = useHabits();
  const { haikuMode, toHaiku } = useHaiku();
  const stage = getStreakStage(currentStreak);
  const today = new Date().toISOString().split("T")[0];

  const getProofStatus = (habitKey: string) => {
    const proof = proofs.find(p => p.habitKey === habitKey && p.timestamp.split("T")[0] === today);
    return proof?.status || null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">{haikuMode ? "Brave soul returns here\nThe path awaits your next step\nWelcome back, hero" : "Welcome back, Adventurer"}</p>
      </div>

      <div className="glass p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-display font-bold text-foreground">Level {level}</span>
          <span className="text-sm text-muted-foreground">{totalXP} Total XP</span>
        </div>
        <Progress value={(currentLevelXP / nextLevelXP) * 100} className="h-3" />
        <p className="text-xs text-muted-foreground">{currentLevelXP} / {nextLevelXP} XP</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame, label: "Current Streak", value: `${currentStreak} days`, glow: "glow-green" },
          { icon: Trophy, label: "Longest Streak", value: `${longestStreak} days`, glow: "glow-gold" },
          { icon: Zap, label: "Growth Stage", value: `${stage.emoji} ${stage.name}`, glow: "glow-purple" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`glass p-4 text-center ${s.glow}`}>
            <s.icon className="h-6 w-6 mx-auto mb-2 text-foreground" />
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-display font-bold text-foreground">Today's Quests</h2>
        {Object.entries(habitSchema).map(([key, schema]) => {
          const done = todayEntry?.habits[key] ?? false;
          const Icon = iconMap[schema.icon] || Brain;
          const proofStatus = getProofStatus(key);
          const requiresProof = schema.requiresProof;

          return (
            <motion.button key={key} whileTap={{ scale: 0.98 }} onClick={() => !requiresProof && toggleHabit(key)}
              className={`w-full glass p-4 flex items-center gap-4 transition-all ${done ? "glow-green border-primary/40" : "hover:bg-muted/30"} ${requiresProof ? "cursor-default" : ""}`}>
              <Icon className={`h-6 w-6 ${done ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1 text-left">
                <p className={`font-medium ${done ? "text-primary" : "text-foreground"}`}>{schema.label}</p>
                <p className="text-xs text-muted-foreground">+{schema.xp} XP</p>
              </div>
              {done && proofStatus === "verified" && <span className="text-xs bg-verified/20 text-verified px-2 py-1 rounded-full">Verified</span>}
              {done && !proofStatus && <CheckCircle2 className="h-5 w-5 text-primary" />}
              {requiresProof && !done && <span className="text-xs text-proof-primary">Proof needed</span>}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
