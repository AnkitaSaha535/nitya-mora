import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabits } from "@/context/HabitContext";
import { useHaiku, ACCOUNTABILITY_HAIKUS } from "@/context/HaikuContext";
import { runAuditor, runEnforcer, EnforcerMessage } from "@/utils/accountabilityEngine";
import { AlertTriangle, Skull, Flame, X, Mail, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEVERITY_CONFIG = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-secondary/20",
    border: "border-secondary/50",
    glow: "glow-gold",
    iconColor: "text-secondary",
    title: "⚠️ Accountability Warning",
    from: "Agent B — The Enforcer",
  },
  critical: {
    icon: Flame,
    bg: "bg-destructive/20",
    border: "border-destructive/50",
    glow: "",
    iconColor: "text-destructive",
    title: "🚨 Critical Streak Alert",
    from: "Agent B — The Enforcer [PRIORITY]",
  },
  nuclear: {
    icon: Skull,
    bg: "bg-destructive/30",
    border: "border-destructive/70",
    glow: "",
    iconColor: "text-destructive",
    title: "☢️ NUCLEAR ACCOUNTABILITY ALERT",
    from: "Agent B — The Enforcer [MAXIMUM PRIORITY]",
  },
};

export default function AccountabilityCoach() {
  const { entries, habitSchema, todayEntry } = useHabits();
  const { haikuMode } = useHaiku();
  const [messages, setMessages] = useState<EnforcerMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"modal" | "email" | null>(null);
  const [temporarilyDismissed, setTemporarilyDismissed] = useState<Set<string>>(new Set());
  const prevAlertKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const alerts = runAuditor(entries, habitSchema);
    const activeAlerts = alerts.filter((alert) => {
      const completedToday = todayEntry?.habits[alert.habitKey] === true;
      return !completedToday;
    });

    const currentAlertKeys = new Set(activeAlerts.map((a) => a.habitKey));
    const newAlerts = activeAlerts.filter(
      (a) => !prevAlertKeys.current.has(a.habitKey)
    );

    if (newAlerts.length > 0) {
      setTemporarilyDismissed((prev) => {
        const next = new Set(prev);
        newAlerts.forEach((a) => next.delete(a.habitKey));
        return next;
      });
    }

    prevAlertKeys.current = currentAlertKeys;

    if (activeAlerts.length === 0) {
      setMessages([]);
      setViewMode(null);
      return;
    }

    const enforcerMessages = activeAlerts.map((alert) =>
      runEnforcer(alert, entries)
    );
    setMessages(enforcerMessages);

    const undismissed = enforcerMessages.filter(
      (m) => !temporarilyDismissed.has(m.alert.habitKey)
    );
    if (undismissed.length > 0) {
      const timer = setTimeout(() => {
        setViewMode("modal");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [entries, habitSchema, todayEntry]);

  const activeMessages = messages.filter(
    (m) => !temporarilyDismissed.has(m.alert.habitKey)
  );
  const currentMessage = activeMessages[currentIndex];

  const handleDismiss = useCallback(() => {
    if (currentMessage) {
      setTemporarilyDismissed((prev) =>
        new Set([...prev, currentMessage.alert.habitKey])
      );
    }
    setCurrentIndex(0);
    const remaining = activeMessages.filter(
      (m) => m.alert.habitKey !== currentMessage?.alert.habitKey
    );
    if (remaining.length === 0) {
      setViewMode(null);
    }
  }, [currentMessage, activeMessages]);

  const toggleView = () => {
    setViewMode((prev) =>
      prev === "modal" ? "email" : prev === "email" ? "modal" : "modal"
    );
  };

  const undismissedCount = activeMessages.length;

  if (messages.length === 0) return null;

  const config = currentMessage
    ? SEVERITY_CONFIG[currentMessage.severity]
    : SEVERITY_CONFIG.warning;

  const getDisplayMessage = (msg: EnforcerMessage) => {
    if (!haikuMode) return msg.message;
    const haikus = ACCOUNTABILITY_HAIKUS[msg.severity] || ACCOUNTABILITY_HAIKUS.warning;
    return haikus[Math.floor(Math.random() * haikus.length)];
  };

  return (
    <>
      {/* Floating notification bell */}
      {undismissedCount > 0 && !viewMode && (
        <motion.button
          onClick={() => setViewMode("modal")}
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full bg-destructive flex items-center justify-center shadow-lg shadow-destructive/30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Bell className="h-6 w-6 text-destructive-foreground" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-xs flex items-center justify-center font-bold text-secondary-foreground">{undismissedCount}</span>
        </motion.button>
      )}

      {/* Modal / Email overlay */}
      <AnimatePresence>
        {viewMode && currentMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && handleDismiss()}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`w-full max-w-lg glass-strong p-6 ${config.border} border-2 ${config.glow}`}>

              {viewMode === "email" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-glass-border pb-3">
                    <Mail className="h-4 w-4" />
                    <span className="font-display">INBOX — Ruthless Accountability</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>From: <span className="text-foreground">{config.from}</span></p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>To: <span className="text-foreground">You (the slacker)</span></p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Subject:{" "}
                      <span className="text-destructive font-bold">RE: Your {currentMessage.alert.habitLabel} Streak —{" "}DESTROYED</span>
                    </p>
                  </div>
                  <p className={`text-foreground leading-relaxed ${haikuMode ? "whitespace-pre-line font-display italic" : ""}`}>{getDisplayMessage(currentMessage)}</p>
                  <div className="text-xs text-muted-foreground/60 italic border-t border-glass-border pt-3">
                    This message was auto-generated by the Ruthless Accountability Engine™. Agent A detected your{" "}
                    {currentMessage.alert.daysMissed}-day failure. Agent B searched your journal and found the receipts.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                      <config.icon className={`h-5 w-5 ${config.iconColor}`} />
                      {config.title}
                    </h3>
                    <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">{currentMessage.alert.habitLabel}</span> — missed{" "}
                    <span className="text-destructive font-bold">{currentMessage.alert.daysMissed} days</span>
                  </p>
                  <p className={`text-foreground leading-relaxed ${haikuMode ? "whitespace-pre-line font-display italic text-accent" : ""}`}>{getDisplayMessage(currentMessage)}</p>

                  {currentMessage.severity === "nuclear" && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <Zap className="h-4 w-4 animate-pulse" />
                      <span>Accountability Protocol Active</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={toggleView} className="text-muted-foreground">
                      <Mail className="h-4 w-4 mr-1" /> View as email
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-muted-foreground">I'll do it later (lie)</Button>
                    <Button size="sm" onClick={handleDismiss} className="bg-primary text-primary-foreground">Fine, I'll do it now</Button>
                  </div>
                </div>
              )}

              {viewMode === "email" && (
                <div className="flex gap-2 pt-4 border-t border-glass-border mt-4">
                  <Button variant="ghost" size="sm" onClick={toggleView}><Bell className="h-4 w-4 mr-1" /> View as notification</Button>
                  <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-muted-foreground">Unsubscribe (you can't)</Button>
                  <Button size="sm" onClick={handleDismiss} className="bg-primary text-primary-foreground">I surrender</Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
