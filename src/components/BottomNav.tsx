import { useLocation, useNavigate } from "react-router-dom";
import { Home, Gamepad2, BookOpen, Timer, ListChecks, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import HaikuToggle from "@/components/HaikuToggle";

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/habits", icon: ListChecks, label: "Habits" },
  { path: "/history", icon: Calendar, label: "History" },
  { path: "/journal", icon: BookOpen, label: "Journal" },
  { path: "/mood-ring", icon: Activity, label: "Mood" },
  { path: "/focus", icon: Timer, label: "Focus" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-glass-border md:hidden">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center justify-around flex-1">
          {tabs.map(tab => {
            const active = location.pathname === tab.path;
            return (
              <button key={tab.path} onClick={() => navigate(tab.path)} className={`flex flex-col items-center gap-1 py-3 px-2 transition-colors relative ${active ? "text-primary" : "text-muted-foreground"}`}>
                {active && <motion.div layoutId="bottomNav" className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary" />}
                <tab.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 pr-2">
          <HaikuToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
