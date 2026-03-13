import { DayEntry } from "@/data/mockData";

export interface StreakAlert {
  habitKey: string;
  habitLabel: string;
  daysMissed: number;
  lastCompletedDate: string | null;
}

export interface EnforcerMessage {
  alert: StreakAlert;
  message: string;
  severity: "warning" | "critical" | "nuclear";
  journalExcerpt: string | null;
}

export function runAuditor(
  entries: DayEntry[],
  habitSchema: Record<string, { label: string; icon: string; xp: number }>
): StreakAlert[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recentEntries = sorted.slice(0, 7);
  const alerts: StreakAlert[] = [];

  for (const [habitKey, schema] of Object.entries(habitSchema)) {
    let missedCount = 0;
    let lastCompleted: string | null = null;

    for (const entry of recentEntries) {
      if (entry.habits[habitKey] === false || entry.habits[habitKey] === undefined) {
        missedCount++;
      } else if (!lastCompleted) {
        lastCompleted = entry.date;
      }
    }

    if (missedCount >= 2) {
      alerts.push({
        habitKey,
        habitLabel: schema.label,
        daysMissed: missedCount,
        lastCompletedDate: lastCompleted,
      });
    }
  }

  return alerts;
}

const ENFORCER_TEMPLATES = {
  warning: [
    (habit: string, days: number, excerpt: string) =>
      `You missed ${habit} for ${days} days straight. Remember when you wrote: "${excerpt}"? Guess that was just vibes, not commitment.`,
    (habit: string, days: number, excerpt: string) =>
      `${days} days without ${habit}. Interesting. Your journal said: "${excerpt}" — was that fiction?`,
    (habit: string, days: number, excerpt: string) =>
      `Hey. ${habit}. ${days} days. Zero excuses. You literally wrote: "${excerpt}". Your past self would be disappointed.`,
  ],
  critical: [
    (habit: string, days: number, excerpt: string) =>
      `🚨 STREAK DESTROYED. ${habit} has been abandoned for ${days} days. Your own words: "${excerpt}". Those words mean nothing now.`,
    (habit: string, days: number, excerpt: string) =>
      `${days} days of silence on ${habit}. You once wrote: "${excerpt}" — that person would barely recognize you right now.`,
    (habit: string, days: number, excerpt: string) =>
      `Let's be brutally honest: ${days} days without ${habit}. You journaled: "${excerpt}". Was that a promise or a performance?`,
  ],
  nuclear: [
    (habit: string, days: number, excerpt: string) =>
      `☢️ NUCLEAR ALERT: ${habit} — ${days} DAYS ABANDONED. Your journal entry: "${excerpt}". Every word of that was a lie you told yourself. Prove me wrong. Today.`,
    (habit: string, days: number, excerpt: string) =>
      `${days} days. ${habit}. Dead. Gone. You wrote: "${excerpt}" and then proceeded to do absolutely nothing about it. The gap between who you say you are and who you actually are is growing. Fix it.`,
  ],
};

function findRelevantJournalExcerpt(
  entries: DayEntry[],
  habitKey: string
): string | null {
  const keywordMap: Record<string, string[]> = {
    exercise: ["workout", "run", "gym", "exercise", "strength", "training", "HIIT", "yoga", "5K", "swimming", "dance"],
    meditation: ["meditation", "meditate", "mindful", "presence", "calm", "breathing", "body scan"],
    deepStudy: ["study", "studied", "learning", "algorithm", "code", "programming", "focus", "deep work"],
  };

  const keywords = keywordMap[habitKey] || [habitKey];
  const sorted = [...entries]
    .filter((e) => e.journalEntry)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const entry of sorted) {
    const lower = entry.journalEntry.toLowerCase();
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      const sentences = entry.journalEntry.split(/[.!?]+/).filter((s) => s.trim());
      const relevant = sentences.find((s) =>
        keywords.some((kw) => s.toLowerCase().includes(kw.toLowerCase()))
      );
      if (relevant) {
        const trimmed = relevant.trim();
        return trimmed.length > 120 ? trimmed.slice(0, 117) + "..." : trimmed;
      }
    }
  }

  for (const entry of sorted.slice(0, 5)) {
    if (entry.journalEntry) {
      const sentences = entry.journalEntry.split(/[.!?]+/).filter((s) => s.trim());
      if (sentences.length > 0) {
        const s = sentences[0].trim();
        return s.length > 120 ? s.slice(0, 117) + "..." : s;
      }
    }
  }

  return null;
}

export function runEnforcer(
  alert: StreakAlert,
  entries: DayEntry[]
): EnforcerMessage {
  const excerpt = findRelevantJournalExcerpt(entries, alert.habitKey);
  const fallbackExcerpt = "I'm going to be consistent this time";

  const severity: EnforcerMessage["severity"] =
    alert.daysMissed >= 5 ? "nuclear" : alert.daysMissed >= 3 ? "critical" : "warning";

  const templates = ENFORCER_TEMPLATES[severity];
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    alert,
    message: template(alert.habitLabel, alert.daysMissed, excerpt || fallbackExcerpt),
    severity,
    journalExcerpt: excerpt,
  };
}
