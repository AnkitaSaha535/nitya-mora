import { useMemo } from "react";
import { motion } from "framer-motion";
import { useHabits } from "@/context/HabitContext";
import { useHaiku, HAIKU_MAP } from "@/context/HaikuContext";
import { analyzeJournalEntry, getSentimentEmoji, getSentimentBgClass, SentimentLabel } from "@/utils/sentimentAnalysis";
import { Activity, Brain, TrendingUp, Hash } from "lucide-react";

export default function MoodRing() {
  const { entries } = useHabits();
  const { haikuMode } = useHaiku();
  const analyzedEntries = useMemo(() => entries.filter(e => e.journalEntry?.trim()).map(e => ({ ...e, analysis: analyzeJournalEntry(e.journalEntry) })).reverse(), [entries]);
  const last14 = analyzedEntries.slice(0, 14);

  const sentimentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    last14.forEach(e => { counts[e.analysis.sentiment] = (counts[e.analysis.sentiment] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [last14]);

  const themeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    last14.forEach(e => { e.analysis.themes.forEach(t => { counts[t] = (counts[t] || 0) + 1; }); });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [last14]);

  const avgMood = useMemo(() => last14.length === 0 ? 0 : Math.round((last14.reduce((s, e) => s + e.mood, 0) / last14.length) * 10) / 10, [last14]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">The Mood Ring</h1>
        <p className="text-muted-foreground">{haikuMode ? "Feelings ebb and flow\nThe ring reveals what words hide\nListen to your heart" : "AI-powered emotional insights from your journal"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Activity, label: "Avg Mood", value: `${avgMood}/10`, glow: "glow-green" },
          { icon: Brain, label: "Entries Analyzed", value: `${last14.length}`, glow: "" },
          { icon: Hash, label: "Themes Found", value: `${themeCounts.length}`, glow: "" },
          { icon: TrendingUp, label: "Top Sentiment", value: sentimentCounts[0]?.[0] || "N/A", glow: "glow-gold" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass p-3 text-center ${s.glow}`}>
            <s.icon className="h-5 w-5 mx-auto mb-1 text-foreground" />
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass p-4">
        <h2 className="font-display font-bold text-foreground mb-3">Sentiment Distribution (14 Days)</h2>
        {sentimentCounts.map(([sentiment, count]) => (
          <div key={sentiment} className="flex items-center gap-3 py-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getSentimentBgClass(sentiment as SentimentLabel)}`}>
              {getSentimentEmoji(sentiment as SentimentLabel)} {haikuMode && HAIKU_MAP[sentiment] ? sentiment : sentiment}
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(count / last14.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{count} days</span>
          </div>
        ))}
      </div>

      <div className="glass p-4">
        <h2 className="font-display font-bold text-foreground mb-3">Theme Cloud</h2>
        <div className="flex flex-wrap gap-2">
          {themeCounts.map(([theme, count], i) => (
            <span key={theme} className={`px-3 py-1.5 rounded-full text-sm glass ${i === 0 ? "text-primary glow-green" : "text-foreground"}`}>
              {theme} ×{count}
            </span>
          ))}
        </div>
      </div>

      <div className="glass p-4 space-y-4">
        <h2 className="font-display font-bold text-foreground">Recent Entry Analysis</h2>
        {analyzedEntries.slice(0, 7).map((entry, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass p-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span>{getSentimentEmoji(entry.analysis.sentiment)}</span>
              <span className="text-sm font-medium text-foreground">{new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentBgClass(entry.analysis.sentiment)}`}>{entry.analysis.sentiment}</span>
              <span className="text-xs text-muted-foreground ml-auto">Mood: {entry.mood}/10</span>
            </div>
            <p className={`text-sm text-muted-foreground line-clamp-2 ${haikuMode ? "whitespace-pre-line font-display italic" : ""}`}>
              {haikuMode && HAIKU_MAP[entry.analysis.sentiment] ? HAIKU_MAP[entry.analysis.sentiment] : entry.journalEntry}
            </p>
            {entry.analysis.themes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.analysis.themes.map(theme => <span key={theme} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{theme}</span>)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
