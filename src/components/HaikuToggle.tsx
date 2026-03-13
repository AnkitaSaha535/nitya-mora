import { Feather } from "lucide-react";
import { useHaiku } from "@/context/HaikuContext";

export default function HaikuToggle() {
  const { haikuMode, toggleHaikuMode } = useHaiku();

  return (
    <button
      onClick={toggleHaikuMode}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display transition-all ${
        haikuMode
          ? "bg-accent/20 text-accent glow-purple"
          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
      }`}
      title={haikuMode ? "Haiku Mode ON — all text becomes haiku" : "Enable Haiku Mode"}
    >
      <Feather className="h-4 w-4" />
      <span className="hidden sm:inline">{haikuMode ? "俳句 ON" : "Haiku"}</span>
    </button>
  );
}
