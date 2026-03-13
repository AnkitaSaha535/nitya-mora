export interface DayEntry {
  date: string;
  habits: {
    deepStudy: boolean;
    exercise: boolean;
    meditation: boolean;
    [key: string]: boolean;
  };
  mood: number; // 1-10
  journalEntry: string;
  journalTimestamp: string;
  xpEarned: number;
}

const journalEntries = [
  "First day of this journey. Set up my workspace, organized my notes, and committed to the process. Meditation was shaky — my mind raced the entire time. But I showed up. That's the seed.",
  "Woke up feeling sluggish. Forced myself through a 15-minute meditation. It wasn't pretty, but the act of sitting down matters more than the quality. Studied algorithms for two hours. Skipped exercise — need to be honest about that.",
  "Bounce-back day. Morning run cleared the fog. 5K in 30 minutes, not great but consistent. Deep study on graph theory felt like a breakthrough. The adjacency list representation finally clicked. Meditation was calm, 20 minutes.",
  "Studied operating systems — process scheduling is fascinating. The parallels between CPU time-slicing and how I manage my own attention aren't lost on me. Exercise was strength training. Meditation before bed helped me sleep like a rock.",
  "Community study group today. Explaining binary search trees to others solidified my understanding. The Feynman technique is real. Quick yoga session for exercise. Meditation was a walking meditation in the park — cherry blossoms everywhere.",
  "Rough day. Anxiety about the upcoming presentation kept pulling me out of focus. Meditation felt like fighting a current. Managed 45 minutes of deep study on database normalization. Went for a stress-relief run — it helped more than I expected.",
  "Missed meditation entirely — overslept after a late night. But the study session was fire: four hours on distributed systems. CAP theorem, consensus algorithms, Paxos. Exercise was a quick HIIT session. Need to fix my sleep schedule.",
  "Rest and recovery. Light study — read research papers on attention and productivity. The science validates everything I'm experiencing with this system. Gentle stretching instead of intense exercise. Meditation was a lovely body scan.",
  "Two-week mark approaching. Can feel the compound effect. Focus sessions are noticeably longer. Studied machine learning — gradient descent optimization. Hit a new PR on my run: 5K in 27:30. Meditation was 25 minutes, longest without clock-checking.",
  "Incredible flow state today. Four hours of deep work on my capstone project flew by. The neural network is finally converging. Gym session was intense — feeling strong. Evening meditation felt like floating. This streak is building something real.",
  "Journaling from a coffee shop. Changed my environment and it sparked new ideas. Studied NLP and transformer architectures — attention mechanisms are elegant. Bodyweight workout at the park. Sunset meditation was magical.",
  "Missed exercise today — knee is bothering me from yesterday's run. But I doubled down on study: five hours on compiler design. Lexical analysis and parsing feel like solving puzzles. Long meditation session to compensate for the physical rest.",
  "Philosophy day mixed with CS. Read Seneca's letters alongside studying ethics in AI. 'We suffer more in imagination than in reality' — applied this during my evening workout when I wanted to quit. Meditation was intentional and grounding.",
  "Breakthrough! During meditation, I had a genuine insight about my procrastination patterns. It's not laziness — it's fear of imperfection. Studied cognitive behavioral therapy alongside data structures. The overlap between debugging code and debugging thoughts is real. Crushed a 10K run.",
  "Teaching day. Tutored a junior student on dynamic programming. Nothing reveals gaps in your knowledge like teaching. Filled those gaps afterward with a targeted study session. Light exercise — swimming laps. Meditation was brief but deep.",
  "Started the day with a 30-minute meditation. Felt centered and sharp all morning. Deep dive into cybersecurity — ethical hacking concepts, SQL injection prevention. The defender's mindset is fascinating. Strength training in the afternoon.",
  "Reflective day. Reviewed my growth over the past two weeks. The data doesn't lie: mood scores are trending up, focus duration increasing. Studied statistics and data visualization — how meta. Light yoga for exercise. Grateful for this system.",
  "Pushed boundaries. Tried a 40-minute meditation — made it to 35 before restlessness won. Studied advanced algorithms: dynamic programming on trees, heavy-light decomposition. Interval training was brutal. Current 5K PR: 26:30.",
  "Group hackathon day. Built a real-time chat app with WebSockets in 6 hours. The team dynamic was electric. Skipped formal exercise but was on my feet all day. Quick meditation before crashing — exhausted but fulfilled.",
  "Recovery from hackathon. Gentle day. Meditation was a body scan — discovered tension I didn't know I was holding. Light study reviewing hackathon code and refactoring. Walk in the park for exercise. Sometimes gentle is what you need.",
  "Deep dive into cloud architecture. AWS, Docker, Kubernetes — the infrastructure layer is where scalability lives. Long meditation morning session. Hit the gym for a full workout. Feeling like the pieces are coming together.",
  "Three weeks in and this feels different from every other 'productivity system' I've tried. The gamification keeps me engaged, but the real reward is who I'm becoming. Studied for final exam prep. Both meditation and exercise felt natural, not forced.",
  "Skipped meditation — had an early morning meeting that threw off my routine. Study session on system design was productive: designed a URL shortener, a rate limiter, and a chat system. Made up for missed meditation with an evening run and stretching.",
  "Art and code day. Studied creative coding with p5.js alongside my regular CS work. The intersection of art and technology is where innovation lives. Meditation was a visualization practice. Dance workout — yes, dance counts as exercise.",
  "Mental health check-in day. Journaled extensively about stress and coping mechanisms. The act of writing itself is therapeutic. Studied psychology of motivation alongside software engineering. Long walk for exercise. Extended loving-kindness meditation.",
  "Final stretch energy. Five days of consistency and I can feel the momentum. Studied competitive programming — solved 8 problems on LeetCode. Morning meditation was laser-focused. Evening run was my fastest yet: 5K in 25:45.",
  "Woke up at 5:30 AM naturally. The discipline is becoming identity. Deep study on blockchain and cryptography — hash functions, Merkle trees. Meditation was transcendent, 30 minutes of pure presence. Strength training was powerful.",
  "Looking back at where I started versus now. The compound effect is undeniable. Focus sessions are 40% longer, resting heart rate has dropped, and I actually look forward to meditation. Studied advanced topics with genuine curiosity.",
  "Penultimate day of this phase. Meditation was 35 minutes — a new record. Studied quantum computing concepts: qubits, superposition, entanglement. The universe is stranger and more beautiful than any code I could write. Yoga and running.",
  "Day 30. Full circle. Every habit completed, every journal entry written, every moment of discomfort transformed into growth. The garden is blooming. The canopy is golden. And tomorrow, I begin again — not because I have to, but because this is who I am now."
];

function getDateDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function getTimestamp(daysAgo: number, hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor(Math.random() * 60), 0);
  return d.toISOString();
}

const INCOMPLETE_DAYS = new Set([1, 6, 18, 22, 24, 28, 29]);

const moodScores = [
  7, 5, 8, 8, 9, 6, 5, 7, 8, 9,
  9, 7, 8, 9, 8, 8, 7, 8, 7, 6,
  8, 9, 5, 8, 7, 9, 9, 8, 9, 10
];

export const mockData: DayEntry[] = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  const isIncomplete = INCOMPLETE_DAYS.has(i);

  let exerciseDone: boolean;
  let meditationDone: boolean;
  const deepStudyDone = true;

  if (i >= 27) {
    exerciseDone = false;
    meditationDone = i === 28;
  } else if (isIncomplete) {
    exerciseDone = i % 3 !== 0;
    meditationDone = i % 2 === 0;
  } else {
    exerciseDone = true;
    meditationDone = true;
  }

  const habitCount = [deepStudyDone, exerciseDone, meditationDone].filter(Boolean).length;

  return {
    date: getDateDaysAgo(daysAgo),
    habits: {
      deepStudy: deepStudyDone,
      exercise: exerciseDone,
      meditation: meditationDone,
    },
    mood: moodScores[i],
    journalEntry: journalEntries[i],
    journalTimestamp: getTimestamp(daysAgo, 21),
    xpEarned: habitCount * 50 + 30,
  };
});

export const HABIT_SCHEMA: Record<string, { label: string; icon: string; xp: number }> = {
  deepStudy: { label: "Deep Study", icon: "BookOpen", xp: 50 },
  exercise: { label: "Exercise", icon: "Dumbbell", xp: 50 },
  meditation: { label: "Meditation", icon: "Brain", xp: 50 },
};
