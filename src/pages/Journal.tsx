import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useHabits } from "@/context/HabitContext";
import { useHaiku } from "@/context/HaikuContext";
import { BookOpen, Send, Calendar, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeJournalEntry, getSentimentEmoji, getSentimentBgClass } from "@/utils/sentimentAnalysis";
import { useNavigate } from "react-router-dom";

export default function Journal() {
  const { entries, addJournalEntry, todayEntry } = useHabits();
  const { haikuMode, toHaiku } = useHaiku();
  const [text, setText] = useState(todayEntry?.journalEntry || "");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const pastEntries = entries.filter(e => e.journalEntry && e.date !== todayEntry?.date).reverse();
  const currentAnalysis = useMemo(() => {
    if (!text.trim()) return null;
    return analyzeJournalEntry(text);
  }, [text]);

  const handleSave = () => {
    if (!text.trim()) return;
    addJournalEntry(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Journal</h1>
        <p className="text-muted-foreground">{haikuMode ? "Ink meets paper's face\nThoughts preserved in gentle lines\nGrow through every word" : "Reflect, grow, earn +30 XP"}</p>
      </div>

      <div className="glass p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-foreground">Today's Reflection</h2>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
        </div>

        {currentAnalysis && (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getSentimentBgClass(currentAnalysis.sentiment)}`}>
            {getSentimentEmoji(currentAnalysis.sentiment)} {currentAnalysis.sentiment}
          </div>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={haikuMode ? "Write your thoughts here...\nThey'll transform to haiku form\nWhen the mode is on" : "How was your day? What did you learn? What challenged you?"}
          className="w-full h-40 bg-muted/20 rounded-lg p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />

        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/mood-ring")} className="text-muted-foreground">
            <Activity className="h-4 w-4 mr-1" /> View Mood Ring
          </Button>
          <Button onClick={handleSave} disabled={!text.trim()} className="bg-primary text-primary-foreground">
            <Send className="h-4 w-4 mr-1" /> {saved ? "Saved! +30 XP" : "Save Entry"}
          </Button>
        </div>
      </div>

      {pastEntries.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display font-bold text-foreground">Past Entries</h2>
          {pastEntries.slice(0, 5).map((entry, i) => {
            const analysis = analyzeJournalEntry(entry.journalEntry);
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentBgClass(analysis.sentiment)}`}>
                    {getSentimentEmoji(analysis.sentiment)} {analysis.sentiment}
                  </span>
                </div>
                <p className={`text-sm text-muted-foreground line-clamp-3 ${haikuMode ? "whitespace-pre-line font-display italic" : ""}`}>
                  {haikuMode ? toHaiku(entry.journalEntry) : entry.journalEntry}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
