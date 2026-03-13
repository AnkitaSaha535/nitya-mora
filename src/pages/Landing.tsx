import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Gamepad2, BookOpen, Timer, Sparkles, ChevronRight, Zap, Trophy, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const navigate = useNavigate();
  const features = [
    { icon: Shield, title: "Privacy Vault", desc: "PIN-locked sanctuary for your data", color: "text-primary" },
    { icon: Gamepad2, title: "Game Arena", desc: "Earn XP through brain-training games", color: "text-secondary" },
    { icon: BookOpen, title: "Journal", desc: "AI-ready reflective journaling", color: "text-accent" },
    { icon: Timer, title: "Focus Mode", desc: "Pomodoro with digital lockdown", color: "text-neon-green" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" /><span className="font-display font-bold text-xl text-foreground">Nityamora</span></div>
        <Button onClick={() => navigate("/home")} variant="ghost" className="text-muted-foreground hover:text-foreground">Enter Vault <ChevronRight className="h-4 w-4 ml-1" /></Button>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-sm font-display text-primary tracking-widest uppercase mb-4">Gamified Productivity Suite</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6">Your Focus <br /><span className="text-gradient-primary">Sanctuary</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">Privacy-first, RPG-gamified productivity. Build habits, earn XP, play brain games, and unlock your potential — all behind your personal vault.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button onClick={() => navigate("/home")} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green text-lg px-8 py-6 font-display">Start Your Journey <ChevronRight className="h-5 w-5 ml-2" /></Button>
            <Button onClick={() => navigate("/games")} variant="outline" size="lg" className="border-muted text-foreground hover:bg-muted/50 text-lg px-8 py-6 font-display">Try Games</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-16">
          {[{ value: "14+", label: "Day Streaks" }, { value: "2,500+", label: "XP Earned" }, { value: "∞", label: "Potential" }].map(s => (
            <div key={s.label} className="text-center"><p className="text-2xl font-display font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass p-6 text-center">
              <f.icon className={`h-8 w-8 mx-auto mb-3 ${f.color}`} />
              <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center py-8 text-muted-foreground/40 text-xs">Built for DAKSHH 2026 AI Protosprint</footer>
    </div>
  );
}
