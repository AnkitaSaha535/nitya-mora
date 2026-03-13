import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useHabits } from "@/context/HabitContext";
import { useHaiku, HAIKU_MAP } from "@/context/HaikuContext";
import { getStreakStage } from "@/utils/streakLogic";
import { Calendar, TrendingUp, Flame, Trophy, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { analyzeJournalEntry, getSentimentEmoji } from "@/utils/sentimentAnalysis";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Emoji mapping for calendar day status
function getDayEmoji(entry: any, habitSchema: any): string {
  if (!entry) return "";
  const allDone = Object.keys(habitSchema).every(k => entry.habits[k]);
  const someDone = Object.keys(habitSchema).some(k => entry.habits[k]);
  const mood = entry.mood;

  if (allDone && mood >= 8) return "🌟";
  if (allDone && mood >= 6) return "✅";
  if (allDone) return "💪";
  if (someDone && mood >= 7) return "🌤️";
  if (someDone) return "⚡";
  if (mood >= 7) return "😊";
  if (mood >= 4) return "😐";
  if (mood > 0) return "😔";
  return "💤";
}

export default function History() {
  const { entries, currentStreak, longestStreak, totalXP, level, habitSchema } = useHabits();
  const { haikuMode, toHaiku } = useHaiku();
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const entryMap = useMemo(() => {
    const map: Record<string, any> = {};
    entries.forEach(e => { map[e.date] = e; });
    return map;
  }, [entries]);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedEntry = selectedDate ? entryMap[selectedDate] : null;

  function getDayStatus(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const entry = entryMap[dateStr];
    if (!entry) return "none";
    const allDone = Object.values(entry.habits).every(Boolean);
    const someDone = Object.values(entry.habits).some(Boolean);
    if (allDone) return "complete";
    if (someDone) return "partial";
    return "missed";
  }

  function handleDayClick(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(prev => prev === dateStr ? null : dateStr);
  }

  const stage = getStreakStage(currentStreak);
  const last7 = entries.slice(-7);
  const weeklyRate = last7.length > 0 ? Math.round((last7.filter(e => Object.values(e.habits).every(Boolean)).length / last7.length) * 100) : 0;
  const monthEntries = entries.filter(e => { const d = new Date(e.date); return d.getFullYear() === year && d.getMonth() === month; });
  const habitStats = Object.entries(habitSchema).map(([key, schema]) => {
    const completed = monthEntries.filter(e => e.habits[key]).length;
    const total = monthEntries.length;
    return { key, label: schema.label, completed, total, rate: total > 0 ? Math.round((completed / total) * 100) : 0 };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Progress History</h1>
        <p className="text-muted-foreground">{haikuMode ? "Days pass like water\nEach mark upon the calendar\nTells of who you are" : "Track your journey, visualize your growth"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Flame, label: "Current Streak", value: `${currentStreak}d`, glow: "glow-green" },
          { icon: Trophy, label: "Longest Streak", value: `${longestStreak}d`, glow: "glow-gold" },
          { icon: TrendingUp, label: "Weekly Rate", value: `${weeklyRate}%`, glow: "glow-purple" },
          { icon: CheckCircle2, label: "Stage", value: `${stage.emoji} ${stage.name}`, glow: "glow-green" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass p-3 text-center ${s.glow}`}>
            <s.icon className="h-5 w-5 mx-auto mb-1 text-foreground" />
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} className="text-muted-foreground hover:text-foreground"><ChevronLeft className="h-5 w-5" /></button>
          <h2 className="font-display font-bold text-foreground">{viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
          <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} className="text-muted-foreground hover:text-foreground"><ChevronRight className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(d => <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={i} />;
            const status = getDayStatus(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split("T")[0];
            const entry = entryMap[dateStr];
            const emoji = getDayEmoji(entry, habitSchema);

            return (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all relative
                  ${isSelected ? "ring-2 ring-primary" : ""} ${isToday ? "ring-1 ring-accent" : ""}
                  ${status === "complete" ? "bg-primary/20 text-primary" : ""}
                  ${status === "partial" ? "bg-secondary/20 text-secondary" : ""}
                  ${status === "missed" ? "bg-destructive/10 text-destructive/60" : ""}
                  ${status === "none" ? "text-muted-foreground/40 hover:bg-muted/20" : "hover:bg-muted/30"}
                `}>
                <span className="text-xs leading-none">{emoji}</span>
                <span className="leading-none">{day}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/20" /> All done</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary/20" /> Partial</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/10" /> Missed</span>
        </div>
      </div>

      {selectedEntry && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-4 space-y-3">
          <h3 className="font-display font-bold text-foreground">{new Date(selectedDate!).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
          {Object.entries(habitSchema).map(([key, schema]) => {
            const done = selectedEntry.habits[key];
            return (
              <div key={key} className="flex items-center gap-3">
                {done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-destructive/50" />}
                <span className="text-sm text-foreground flex-1">{schema.label}</span>
                <span className="text-xs text-muted-foreground">{done ? `+${schema.xp} XP` : "—"}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-glass-border">
            <span>Mood: {"⭐".repeat(Math.round(selectedEntry.mood / 2))}</span>
            <span>XP: {selectedEntry.xpEarned}</span>
          </div>
          {selectedEntry.journalEntry && (
            <p className={`text-sm text-muted-foreground italic ${haikuMode ? "whitespace-pre-line font-display" : ""}`}>
              {haikuMode ? toHaiku(selectedEntry.journalEntry) : selectedEntry.journalEntry}
            </p>
          )}
        </motion.div>
      )}

      <div className="glass p-4 space-y-3">
        <h2 className="font-display font-bold text-foreground">Monthly Habit Breakdown</h2>
        {habitStats.map(h => (
          <div key={h.key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">{h.label}</span>
              <span className="text-muted-foreground">{h.completed}/{h.total} days · {h.rate}%</span>
            </div>
            <Progress value={h.rate} className="h-2" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
