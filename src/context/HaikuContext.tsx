import { createContext, useContext, useState, ReactNode } from "react";

interface HaikuContextType {
  haikuMode: boolean;
  toggleHaikuMode: () => void;
  toHaiku: (text: string) => string;
}

const HaikuContext = createContext<HaikuContextType | null>(null);

export function useHaiku() {
  const ctx = useContext(HaikuContext);
  if (!ctx) throw new Error("useHaiku must be inside HaikuProvider");
  return ctx;
}

// Pre-defined haiku mappings for common app text patterns
const HAIKU_MAP: Record<string, string> = {
  // Mood Ring summaries
  "Positive": "Sun breaks through the clouds\nJoy blooms in the quiet heart\nLight fills every step",
  "Anxious": "Storm clouds gather near\nRestless winds stir in the mind\nBreathe and find your calm",
  "Lethargic": "Heavy limbs rest still\nThe world moves but I stay here\nSleep calls me again",
  "Neutral": "Neither sun nor rain\nThe day passes without note\nStillness has its place",
  "Motivated": "Fire burns in my soul\nEach step forward fuels the next\nNothing stops me now",
  "Reflective": "Mirror shows my path\nLessons learned from yesterday\nGrowth in every scar",
  "Stressed": "Pressure builds like waves\nCrashing on a weary shore\nStill I stand my ground",
};

// Haiku-style toast/alert messages
const TOAST_HAIKUS: string[] = [
  "Task done with great care\nProgress blooms like spring flowers\nOnward, warrior",
  "The habit is marked\nAnother step on the path\nStrength builds quietly",
  "Journal saved with love\nWords become wisdom with time\nReflect and grow strong",
  "Proof has been received\nThe AI judges your work\nTruth reveals itself",
  "Streak alive and well\nConsistency is the key\nKeep the fire lit",
  "New day, fresh chances\nYesterday's gone like the wind\nMake this moment count",
  "XP earned today\nThe level rises with grit\nLegends are made here",
];

const REJECTION_HAIKUS: string[] = [
  "Nice try, wanderer\nBut the proof does not convince\nTry again with truth",
  "The lens sees through lies\nSubmit what's real, not a dream\nHonesty wins XP",
  "A photo was sent\nBut the habit was not done\nDo the work, then prove",
];

const VERIFICATION_HAIKUS: string[] = [
  "The proof stands the test\nHabit completed with care\nXP flows to you",
  "Verified and true\nThe grind speaks louder than words\nWell done, warrior",
  "Evidence is clear\nYou showed up and did the work\nRespect is earned here",
];

const ACCOUNTABILITY_HAIKUS: Record<string, string[]> = {
  warning: [
    "Days slip through your hands\nThe habit fades like old ink\nWake up before gone",
    "You wrote of great plans\nBut action tells a new tale\nBridge the growing gap",
  ],
  critical: [
    "Streak lies shattered now\nYour own words haunt empty days\nRevive what you lost",
    "Silence speaks volumes\nThe habit screams in the void\nAnswer with action",
  ],
  nuclear: [
    "Ashes of your vow\nScattered by neglect and time\nRise or fade away",
    "The gap yawns wider\nWho you are and who you said\nChoose now — prove me wrong",
  ],
};

// Simple syllable counter (approximate)
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 2) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Generate a haiku from arbitrary text by extracting key words
function generateHaikuFromText(text: string): string {
  if (!text || text.trim().length === 0) return "Empty thoughts remain\nSilence fills the waiting page\nWrite your story now";

  // Check if we have a direct mapping
  for (const [key, haiku] of Object.entries(HAIKU_MAP)) {
    if (text.includes(key) || text.toLowerCase().includes(key.toLowerCase())) {
      return haiku;
    }
  }

  // Extract meaningful words
  const words = text.split(/\s+/).filter(w => w.length > 2 && !/^(the|and|but|for|are|was|not|you|all|can|had|her|his|how|its|may|our|too|use|way|who|did|get|has|him|let|say|she|one|two|new|now|old|see|own|boy|big|end|why|try|ask|men|ran|off|put|run|set|top|yes|yet|few|got|sit|eye|met|pay|key|cut|hot|deal|face|fact|felt|game|gave|gone|hard|help|here|high|hold|home|hope|idea|just|keep|kind|knew|last|late|left|less|life|like|line|list|live|long|look|lord|lose|lost|made|make|many|mark|mind|miss|more|most|move|much|must|name|near|need|next|only|open|over|part|past|plan|play|real|rest|room|rule|same|seem|self|show|side|some|soon|sort|such|sure|take|talk|tell|than|that|them|then|they|this|time|true|turn|upon|used|very|want|well|went|were|what|when|will|with|word|work|year|your|from|have|been|each|into|back|also|come|able|does|done|gave|gone|good|hand|best|both|call|came|case|city|came|even|ever|fact|find|form|gave|give|goes|gone|good|grew|half|hand|hard|head|hear|help|here|high|hold|home|hope|hour|idea|into|just|keep|kind|knew|land|last|late|lead|left|less|life|like|line|link|live|long|look|lose|lost|made|make|many|mean|mind|miss|more|most|move|much|must|name|near|need|next|note|only|open|once|over|page|part|past|plan|play|read|real|rest|road|role|room|rule|same|seen|self|sent|show|side|sign|site|size|slow|some|soon|sort|step|such|sure|take|talk|tell|term|test|text|than|that|them|then|they|this|told|took|true|turn|type|upon|used|very|view|vote|walk|wall|want|week|well|went|were|what|when|wide|will|wind|with|wish|word|work|year|your)$/i.test(w));

  const keyWords = words.slice(0, 10);

  if (keyWords.length < 3) {
    return "Words drift like petals\nMeaning hides between the lines\nSeek and you shall find";
  }

  // Build lines targeting 5-7-5 syllables
  const lines: string[] = [];
  const targets = [5, 7, 5];
  let wordIdx = 0;

  for (const target of targets) {
    let syllables = 0;
    const lineWords: string[] = [];

    while (wordIdx < keyWords.length && syllables < target) {
      const word = keyWords[wordIdx];
      const s = countSyllables(word);
      if (syllables + s <= target + 1) {
        lineWords.push(word.replace(/[^a-zA-Z'-]/g, ''));
        syllables += s;
        wordIdx++;
      } else {
        break;
      }
    }

    if (lineWords.length === 0) {
      lineWords.push(wordIdx < keyWords.length ? keyWords[wordIdx++] || "silence" : "silence");
    }

    lines.push(lineWords.join(" "));
  }

  return lines.join("\n");
}

export function HaikuProvider({ children }: { children: ReactNode }) {
  const [haikuMode, setHaikuMode] = useState(() => {
    const saved = localStorage.getItem("nityamora-haiku-mode");
    return saved === "true";
  });

  const toggleHaikuMode = () => {
    setHaikuMode(prev => {
      const next = !prev;
      localStorage.setItem("nityamora-haiku-mode", String(next));
      return next;
    });
  };

  const toHaiku = (text: string): string => {
    if (!haikuMode) return text;
    return generateHaikuFromText(text);
  };

  return (
    <HaikuContext.Provider value={{ haikuMode, toggleHaikuMode, toHaiku }}>
      {children}
    </HaikuContext.Provider>
  );
}

// Export haiku collections for use in other components
export { HAIKU_MAP, TOAST_HAIKUS, REJECTION_HAIKUS, VERIFICATION_HAIKUS, ACCOUNTABILITY_HAIKUS };
