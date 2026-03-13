import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import { useHabits } from "@/context/HabitContext";

export default function Vault() {
  const { pin, unlock } = useHabits();
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDigit = (d: string) => {
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);
    setError(false);
    if (next.length === 4) {
      if (next === pin) {
        setTimeout(unlock, 300);
      } else {
        setError(true);
        setTimeout(() => { setEntered(""); setError(false); }, 800);
      }
    }
  };

  const handleDelete = () => {
    setEntered(prev => prev.slice(0, -1));
    setError(false);
  };

  const digits = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <Shield className="h-16 w-16 text-primary glow-green" />
          <h1 className="text-3xl font-display font-bold text-foreground">Nityamora</h1>
          <p className="text-muted-foreground text-sm">Enter your PIN to unlock your sanctuary</p>
        </div>

        {/* PIN dots */}
        <div className="flex gap-4">
          {[0,1,2,3].map(i => (
            <motion.div
              key={i}
              animate={error && entered.length > i ? { scale: [1, 1.3, 1] } : {}}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                error ? "border-destructive bg-destructive" :
                entered.length > i ? "border-primary bg-primary glow-green" : "border-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3">
          {digits.map((d, i) => (
            d === "" ? <div key={i} /> :
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => d === "⌫" ? handleDelete() : handleDigit(d)}
              className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-xl font-display font-semibold text-foreground hover:bg-muted/50 transition-colors active:glow-green"
            >
              {d}
            </motion.button>
          ))}
        </div>

        <p className="text-muted-foreground/40 text-xs">Default PIN: 1234</p>
      </motion.div>

      {/* Hidden input for keyboard support */}
      <input
        ref={inputRef}
        type="tel"
        className="absolute opacity-0 w-0 h-0"
        maxLength={4}
        value={entered}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          setEntered("");
          val.split("").forEach(d => handleDigit(d));
        }}
        onKeyDown={e => {
          if (e.key === "Backspace") handleDelete();
        }}
      />
    </motion.div>
  );
}
