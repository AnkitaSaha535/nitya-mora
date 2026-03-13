import { useLocation, useNavigate } from "react-router-dom";
import { Home, Gamepad2, BookOpen, Timer, Sparkles, ChevronLeft, ChevronRight, Calendar, ListChecks, Activity } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabits } from "@/context/HabitContext";
import ThemeToggle from "@/components/ThemeToggle";
import HaikuToggle from "@/components/HaikuToggle";

const navItems = [
  { path: "/home", icon: Home, label: "Dashboard" },
  { path: "/habits", icon: ListChecks, label: "Habits" },
  { path: "/history", icon: Calendar, label: "History" },
  { path: "/games", icon: Gamepad2, label: "Game Arena" },
  { path: "/journal", icon: BookOpen, label: "Journal" },
  { path: "/mood-ring", icon: Activity, label: "Mood Ring" },
  { path: "/focus", icon: Timer, label: "Focus Mode" },
];

export default function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { level, totalXP } = useHabits();

  return (
    <aside className={`hidden md:flex flex-col h-screen sticky top-0 glass-strong border-r border-glass-border transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}>
      <div className="flex items-center justify-between p-4">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-display font-bold text-foreground">Nityamora</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-muted/30 text-muted-foreground">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? "bg-primary/10 text-primary glow-green" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-sm font-medium whitespace-nowrap overflow-hidden">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-glass-border">
        <div className="flex items-center gap-2 justify-center">
          <HaikuToggle />
          <ThemeToggle />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">Level {level} · {totalXP} XP</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
