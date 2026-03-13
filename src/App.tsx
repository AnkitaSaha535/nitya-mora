import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HabitProvider, useHabits } from "@/context/HabitContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { HaikuProvider } from "@/context/HaikuContext";
import Vault from "@/components/Vault";
import BottomNav from "@/components/BottomNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import AccountabilityCoach from "@/components/AccountabilityCoach";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Games from "@/pages/Games";
import Journal from "@/pages/Journal";
import Focus from "@/pages/Focus";
import History from "@/pages/History";
import Habits from "@/pages/Habits";
import MoodRing from "@/pages/MoodRing";
import NotFound from "@/pages/NotFound";
import TicTacToe from "@/components/games/TicTacToe";
import MemoryMatch from "@/components/games/MemoryMatch";
import SnakeGame from "@/components/games/SnakeGame";
import WordScramble from "@/components/games/WordScramble";
import ColorMatch from "@/components/games/ColorMatch";
import ReactionTime from "@/components/games/ReactionTime";
import MathBlitz from "@/components/games/MathBlitz";
import ConnectFour from "@/components/games/ConnectFour";

const queryClient = new QueryClient();

function AppShell() {
  const { isUnlocked } = useHabits();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const showNav = isUnlocked && !isLanding;

  if (!isUnlocked && !isLanding) return <Vault />;

  return (
    <div className="flex min-h-screen">
      {showNav && <DesktopSidebar />}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/tictactoe" element={<TicTacToe />} />
          <Route path="/games/memory" element={<MemoryMatch />} />
          <Route path="/games/snake" element={<SnakeGame />} />
          <Route path="/games/word-scramble" element={<WordScramble />} />
          <Route path="/games/color-match" element={<ColorMatch />} />
          <Route path="/games/reaction" element={<ReactionTime />} />
          <Route path="/games/math-blitz" element={<MathBlitz />} />
          <Route path="/games/connect-four" element={<ConnectFour />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/history" element={<History />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/mood-ring" element={<MoodRing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showNav && <BottomNav />}
      {showNav && <AccountabilityCoach />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <HaikuProvider>
          <HabitProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppShell />
            </BrowserRouter>
          </HabitProvider>
        </HaikuProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
