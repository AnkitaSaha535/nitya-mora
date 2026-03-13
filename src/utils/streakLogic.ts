import { DayEntry } from "@/data/mockData";

function isAllHabitsComplete(entry: DayEntry): boolean {
  return Object.values(entry.habits).every(Boolean);
}

export function calculateCurrentStreak(entries: DayEntry[]): number {
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  for (const entry of sorted) {
    if (isAllHabitsComplete(entry)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateLongestStreak(entries: DayEntry[]): number {
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let longest = 0;
  let current = 0;
  for (const entry of sorted) {
    if (isAllHabitsComplete(entry)) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

export function getStreakStage(streak: number): { name: string; emoji: string } {
  if (streak >= 30) return { name: "Golden Canopy", emoji: "🌳" };
  if (streak >= 6) return { name: "Flower", emoji: "🌸" };
  if (streak >= 4) return { name: "Sprout", emoji: "🌱" };
  if (streak >= 1) return { name: "Seed", emoji: "🫘" };
  return { name: "Dormant", emoji: "💤" };
}

export function calculateLevel(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
  const xpPerLevel = 500;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const currentXP = totalXP % xpPerLevel;
  return { level, currentXP, nextLevelXP: xpPerLevel };
}

export function getTotalXP(entries: DayEntry[]): number {
  return entries.reduce((sum, e) => sum + e.xpEarned, 0);
}
