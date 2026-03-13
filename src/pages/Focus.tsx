import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Lock, Unlock, MonitorOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISTRACTING_APPS = [
  { name: "Social Media", icon: "📱" },
  { name: "Video Stream", icon: "📺" },
  { name: "Chat App", icon: "💬" },
  { name: "News Feed", icon: "📰" },
  { name: "Online Shop", icon: "🛒" },
  { name: "Game Store", icon: "🎮" },
];

export default function Focus() {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [lockdown, setLockdown] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const totalTime = mode === "work" ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRunning(false);
            if (mode === "work") { setSessions(s => s + 1); setMode("break"); setLockdown(false); return 5 * 60; }
            else { setMode("work"); return 25 * 60; }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const toggleRunning = () => { setRunning(!running); if (!running && mode === "work") setLockdown(true); };
  const reset = () => { setRunning(false); setLockdown(false); setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60); };
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Focus Mode</h1>
        <p className="text-muted-foreground">25/5 Pomodoro with Digital Lockdown</p>
      </div>

      <div className="glass p-8 text-center space-y-6">
        <div className="relative inline-block">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold text-foreground">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
            <span className={`text-sm font-display ${mode === "work" ? "text-primary" : "text-secondary"}`}>{mode === "work" ? "FOCUS" : "BREAK"}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={toggleRunning} size="lg" className={mode === "work" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}>
            {running ? <><Pause className="h-5 w-5 mr-2" /> Pause</> : <><Play className="h-5 w-5 mr-2" /> Start</>}
          </Button>
          <Button onClick={reset} variant="ghost" size="icon"><RotateCcw className="h-5 w-5" /></Button>
        </div>

        <p className="text-sm text-muted-foreground">Sessions completed: {sessions}</p>
      </div>

      <div className="glass p-4 space-y-3">
        <div className="flex items-center gap-2">
          {lockdown ? <Lock className="h-5 w-5 text-destructive" /> : <Unlock className="h-5 w-5 text-muted-foreground" />}
          <h2 className="font-display font-bold text-foreground">Digital Lockdown {lockdown ? <span className="text-destructive">ACTIVE</span> : <span className="text-muted-foreground">Inactive</span>}</h2>
        </div>
        {DISTRACTING_APPS.map(app => (
          <div key={app.name} className={`flex items-center gap-3 p-2 rounded-lg ${lockdown ? "bg-destructive/10" : ""}`}>
            <span className="text-lg">{app.icon}</span>
            <span className="text-sm text-foreground flex-1">{app.name}</span>
            {lockdown && <MonitorOff className="h-4 w-4 text-destructive" />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
