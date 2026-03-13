export type SentimentLabel = "Positive" | "Anxious" | "Lethargic" | "Neutral" | "Motivated" | "Reflective" | "Stressed";

export interface JournalAnalysis {
  sentiment: SentimentLabel;
  sentimentScore: number;
  themes: string[];
  keywords: string[];
}

const POSITIVE_WORDS = new Set([
  "breakthrough", "incredible", "amazing", "happy", "great", "love", "wonderful",
  "fantastic", "excellent", "beautiful", "proud", "confident", "strong", "powerful",
  "inspired", "grateful", "fulfilled", "magical", "transcendent", "blooming",
  "electric", "fire", "crushed", "sharp", "centered", "elegant", "innovation",
  "momentum", "growth", "clarity", "flow", "focused", "natural", "genuine",
  "undeniable", "transformed", "celebrate", "joyful", "energized", "thriving"
]);

const NEGATIVE_WORDS = new Set([
  "anxious", "anxiety", "stressed", "stress", "rough", "sluggish", "tired",
  "exhausted", "overwhelmed", "frustrated", "missed", "failed", "fear",
  "worried", "struggling", "restless", "tension", "difficult", "painful",
  "lazy", "procrastination", "quit", "crashed", "bothering", "shaky",
  "fighting", "discomfort", "lethargic", "burnout", "overslept"
]);

const THEME_PATTERNS: Record<string, RegExp[]> = {
  "Work Stress": [/work\s*stress/i, /deadline/i, /overwork/i, /meeting/i, /presentation/i, /pressure/i],
  "Good Sleep": [/sleep|slept|rest|recovery|nap/i, /sleep like a rock/i, /rested/i],
  "Exercise": [/run|workout|exercise|gym|training|yoga|swimming|HIIT|strength|5K|10K|dance/i],
  "Meditation": [/meditat|mindful|body scan|breathing|presence|calm|centered/i],
  "Study": [/study|learn|algorithm|programming|code|computer science|research|exam/i],
  "Family": [/family|parent|sibling|child|home|loved ones/i],
  "Social": [/friend|group|team|community|tutored|teaching|hackathon/i],
  "Self-Growth": [/growth|improve|discipline|identity|compound|breakthrough|insight/i],
  "Mental Health": [/anxiety|stress|therapy|coping|mental health|procrastination|fear/i],
  "Creativity": [/creative|art|innovation|ideas|design|inspired|p5\.js/i],
  "Nature": [/park|sunset|cherry blossom|walk|nature|outdoors/i],
  "Philosophy": [/philosophy|seneca|stoic|ethics|meaning|purpose|reflection/i],
};

export function analyzeJournalEntry(text: string): JournalAnalysis {
  if (!text || text.trim().length === 0) {
    return { sentiment: "Neutral", sentimentScore: 0, themes: [], keywords: [] };
  }

  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);

  let positiveCount = 0;
  let negativeCount = 0;
  const foundKeywords: string[] = [];

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) {
      positiveCount++;
      if (!foundKeywords.includes(word)) foundKeywords.push(word);
    }
    if (NEGATIVE_WORDS.has(word)) {
      negativeCount++;
      if (!foundKeywords.includes(word)) foundKeywords.push(word);
    }
  }

  const total = positiveCount + negativeCount || 1;
  const sentimentScore = Math.round(((positiveCount - negativeCount) / total) * 100) / 100;

  const themes: string[] = [];
  for (const [theme, patterns] of Object.entries(THEME_PATTERNS)) {
    if (patterns.some(p => p.test(text))) {
      themes.push(theme);
    }
  }

  let sentiment: SentimentLabel;
  if (sentimentScore > 0.4) sentiment = "Motivated";
  else if (sentimentScore > 0.2) sentiment = "Positive";
  else if (sentimentScore > 0) sentiment = "Reflective";
  else if (sentimentScore === 0 && negativeCount === 0) sentiment = "Neutral";
  else if (sentimentScore > -0.3) sentiment = "Anxious";
  else if (/sluggish|tired|lethargic|exhausted|overslept/i.test(text)) sentiment = "Lethargic";
  else sentiment = "Stressed";

  return {
    sentiment,
    sentimentScore,
    themes: themes.slice(0, 5),
    keywords: foundKeywords.slice(0, 8),
  };
}

export function getSentimentColor(sentiment: SentimentLabel): string {
  switch (sentiment) {
    case "Positive": return "hsl(145, 65%, 42%)";
    case "Motivated": return "hsl(42, 90%, 55%)";
    case "Reflective": return "hsl(200, 60%, 50%)";
    case "Neutral": return "hsl(120, 5%, 55%)";
    case "Anxious": return "hsl(30, 80%, 55%)";
    case "Lethargic": return "hsl(260, 40%, 50%)";
    case "Stressed": return "hsl(0, 72%, 51%)";
    default: return "hsl(120, 5%, 55%)";
  }
}

export function getSentimentEmoji(sentiment: SentimentLabel): string {
  switch (sentiment) {
    case "Positive": return "😊";
    case "Motivated": return "🔥";
    case "Reflective": return "🤔";
    case "Neutral": return "😐";
    case "Anxious": return "😰";
    case "Lethargic": return "😴";
    case "Stressed": return "😤";
    default: return "😐";
  }
}

export function getSentimentBgClass(sentiment: SentimentLabel): string {
  switch (sentiment) {
    case "Positive": return "bg-primary/20 text-primary";
    case "Motivated": return "bg-secondary/20 text-secondary";
    case "Reflective": return "bg-accent/20 text-accent";
    case "Neutral": return "bg-muted text-muted-foreground";
    case "Anxious": return "bg-secondary/30 text-secondary";
    case "Lethargic": return "bg-accent/30 text-accent";
    case "Stressed": return "bg-destructive/20 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}
