import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { mockData, DayEntry, HABIT_SCHEMA } from "@/data/mockData";
import { calculateCurrentStreak, calculateLongestStreak, getTotalXP, calculateLevel } from "@/utils/streakLogic";

export interface ProofOfWork {
  habitKey: string;
  imageDataUrl: string;
  status: "pending" | "verified" | "rejected";
  aiComment: string;
  timestamp: string;
}

interface HabitContextType {
  entries: DayEntry[];
  todayEntry: DayEntry | null;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  habitSchema: Record<string, { label: string; icon: string; xp: number; requiresProof?: boolean }>;
  toggleHabit: (habitKey: string) => void;
  addJournalEntry: (text: string) => void;
  addCustomHabit: (key: string, label: string, xp: number) => void;
  removeCustomHabit: (key: string) => void;
  isUnlocked: boolean;
  unlock: () => void;
  pin: string;
  setPin: (p: string) => void;
  proofs: ProofOfWork[];
  addProof: (proof: ProofOfWork) => void;
  updateProofStatus: (habitKey: string, status: "verified" | "rejected", comment: string) => void;
  setHabitRequiresProof: (habitKey: string, requires: boolean) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be inside HabitProvider");
  return ctx;
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const [customSchema, setCustomSchema] = useState<Record<string, { label: string; icon: string; xp: number; requiresProof?: boolean }>>(() => {
    const schema: Record<string, { label: string; icon: string; xp: number; requiresProof?: boolean }> = {};
    for (const [key, val] of Object.entries(HABIT_SCHEMA)) {
      schema[key] = { ...val, requiresProof: true };
    }
    return schema;
  });

  const [entries, setEntries] = useState<DayEntry[]>(() => {
    const today = new Date().toISOString().split("T")[0];
    const hasToday = mockData.some(e => e.date === today);
    if (!hasToday) {
      return [...mockData, {
        date: today,
        habits: Object.fromEntries(Object.keys(HABIT_SCHEMA).map(k => [k, false])) as any,
        mood: 0,
        journalEntry: "",
        journalTimestamp: "",
        xpEarned: 0,
      }];
    }
    return [...mockData];
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("1234");
  const [proofs, setProofs] = useState<ProofOfWork[]>([]);

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find(e => e.date === today) || null;

  const currentStreak = calculateCurrentStreak(entries.filter(e => e.date !== today));
  const longestStreak = calculateLongestStreak(entries);
  const totalXP = getTotalXP(entries);
  const { level, currentXP: currentLevelXP, nextLevelXP } = calculateLevel(totalXP);

  const toggleHabit = useCallback((habitKey: string) => {
    setEntries(prev => prev.map(e => {
      if (e.date !== today) return e;
      const newHabits = { ...e.habits, [habitKey]: !e.habits[habitKey] };
      const xpDelta = !e.habits[habitKey] ? customSchema[habitKey]?.xp || 50 : -(customSchema[habitKey]?.xp || 50);
      return { ...e, habits: newHabits, xpEarned: Math.max(0, e.xpEarned + xpDelta) };
    }));
  }, [today, customSchema]);

  const addJournalEntry = useCallback((text: string) => {
    setEntries(prev => prev.map(e => {
      if (e.date !== today) return e;
      return { ...e, journalEntry: text, journalTimestamp: new Date().toISOString(), xpEarned: e.xpEarned + 30 };
    }));
  }, [today]);

  const addCustomHabit = useCallback((key: string, label: string, xp: number) => {
    setCustomSchema(prev => ({ ...prev, [key]: { label, icon: "Brain", xp, requiresProof: true } }));
    setEntries(prev => prev.map(e => ({
      ...e,
      habits: { ...e.habits, [key]: e.habits[key] ?? false },
    })));
  }, []);

  const removeCustomHabit = useCallback((key: string) => {
    setCustomSchema(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const addProof = useCallback((proof: ProofOfWork) => {
    setProofs(prev => {
      const filtered = prev.filter(p => !(p.habitKey === proof.habitKey && p.timestamp.split("T")[0] === today));
      return [...filtered, proof];
    });
  }, [today]);

  const updateProofStatus = useCallback((habitKey: string, status: "verified" | "rejected", comment: string) => {
    setProofs(prev => prev.map(p => {
      if (p.habitKey === habitKey && p.timestamp.split("T")[0] === today) {
        return { ...p, status, aiComment: comment };
      }
      return p;
    }));
    if (status === "verified") {
      setEntries(prev => prev.map(e => {
        if (e.date !== today) return e;
        if (e.habits[habitKey]) return e;
        const newHabits = { ...e.habits, [habitKey]: true };
        const xpDelta = customSchema[habitKey]?.xp || 50;
        return { ...e, habits: newHabits, xpEarned: e.xpEarned + xpDelta };
      }));
    }
  }, [today, customSchema]);

  const setHabitRequiresProof = useCallback((habitKey: string, requires: boolean) => {
    setCustomSchema(prev => ({
      ...prev,
      [habitKey]: { ...prev[habitKey], requiresProof: requires },
    }));
  }, []);

  return (
    <HabitContext.Provider value={{
      entries, todayEntry, currentStreak, longestStreak, totalXP, level, currentLevelXP, nextLevelXP,
      habitSchema: customSchema, toggleHabit, addJournalEntry, addCustomHabit, removeCustomHabit,
      isUnlocked, unlock: () => setIsUnlocked(true), pin, setPin,
      proofs, addProof, updateProofStatus, setHabitRequiresProof,
    }}>
      {children}
    </HabitContext.Provider>
  );
}
