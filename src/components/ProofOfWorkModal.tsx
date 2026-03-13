import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabits, ProofOfWork } from "@/context/HabitContext";
import { useHaiku, VERIFICATION_HAIKUS, REJECTION_HAIKUS } from "@/context/HaikuContext";
import { Camera, X, Upload, CheckCircle2, XCircle, RotateCcw, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sarcastic rejection comments
const SARCASTIC_REJECTIONS = [
  "Nice try. That's about as related to {habit} as a fish is to a bicycle.",
  "I've seen stock photos more convincing than this. Try again, champ.",
  "Did you just Google '{habit}' and screenshot the results? We both know that's not your photo.",
  "Congratulations, you've proven you can upload a random image. Now actually do the habit.",
  "I'm an AI, not gullible. That photo has nothing to do with {habit}. Receipts or it didn't happen.",
  "That's a bold move, Cotton. Unfortunately, bold doesn't equal honest. Where's the real proof?",
  "Ah yes, the classic 'upload something vaguely related and hope the AI is dumb' strategy. Denied.",
];

// Verification success comments
const VERIFICATION_SUCCESSES = [
  "Look at you, actually doing the thing! {habit} — verified. Your streak lives another day.",
  "Well well well. Proof submitted and accepted. I'm almost proud. Almost.",
  "Verified! See? Was that so hard? Don't answer that.",
  "The receipts check out. {habit} is officially done. Your past self would be relieved.",
  "Proof accepted. The gap between what you say and what you do just got a little smaller.",
];

interface ProofOfWorkModalProps {
  habitKey: string;
  habitLabel: string;
  onClose: () => void;
}

export default function ProofOfWorkModal({ habitKey, habitLabel, onClose }: ProofOfWorkModalProps) {
  const { addProof, updateProofStatus, proofs } = useHabits();
  const { haikuMode } = useHaiku();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "verified" | "rejected">("idle");
  const [aiComment, setAiComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const existingProof = proofs.find(p => p.habitKey === habitKey && p.timestamp.split("T")[0] === today);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImageUrl(dataUrl);
      setStatus("idle");
    };
    reader.readAsDataURL(file);
  };

  const handleVerify = () => {
    if (!imageUrl) return;

    setStatus("scanning");

    const proof: ProofOfWork = {
      habitKey,
      imageDataUrl: imageUrl,
      status: "pending",
      aiComment: "",
      timestamp: new Date().toISOString(),
    };
    addProof(proof);

    setTimeout(() => {
      const isVerified = Math.random() > 0.3;

      if (isVerified) {
        const comment = haikuMode
          ? VERIFICATION_HAIKUS[Math.floor(Math.random() * VERIFICATION_HAIKUS.length)]
          : VERIFICATION_SUCCESSES[Math.floor(Math.random() * VERIFICATION_SUCCESSES.length)].replace("{habit}", habitLabel);
        setAiComment(comment);
        setStatus("verified");
        updateProofStatus(habitKey, "verified", comment);
      } else {
        const comment = haikuMode
          ? REJECTION_HAIKUS[Math.floor(Math.random() * REJECTION_HAIKUS.length)]
          : SARCASTIC_REJECTIONS[Math.floor(Math.random() * SARCASTIC_REJECTIONS.length)].replace("{habit}", habitLabel);
        setAiComment(comment);
        setStatus("rejected");
        updateProofStatus(habitKey, "rejected", comment);
      }
    }, 2500);
  };

  const handleRetry = () => {
    setImageUrl(null);
    setStatus("idle");
    setAiComment("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && status !== "scanning" && onClose()}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md glass-strong border-2 border-proof-primary/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          <div>
            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
              <Camera className="h-5 w-5 text-proof-primary" /> Proof of Work
            </h3>
            <p className="text-sm text-muted-foreground">{habitLabel}</p>
          </div>
          {status !== "scanning" && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />

          {!imageUrl ? (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-proof-primary/30 rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-proof-primary/60 hover:bg-proof-primary/5 transition-all">
              <Upload className="h-12 w-12 text-proof-primary/50" />
              <div className="text-center">
                <p className="font-display font-semibold text-foreground">Upload your proof</p>
                <p className="text-sm text-muted-foreground mt-1">Take a photo or upload an image proving you completed "{habitLabel}"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img src={imageUrl} alt="Proof" className="w-full h-48 object-cover" />

                {status === "scanning" && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <div className="absolute inset-x-0 h-1 bg-proof-primary/50 animate-scan-line" />
                    <Scan className="h-8 w-8 text-proof-primary animate-pulse" />
                    <span className="ml-2 text-proof-primary font-display">Analyzing...</span>
                  </div>
                )}

                {status === "verified" && (
                  <div className="absolute inset-0 bg-verified/20 flex items-center justify-center">
                    <CheckCircle2 className="h-16 w-16 text-verified" />
                  </div>
                )}

                {status === "rejected" && (
                  <div className="absolute inset-0 bg-rejected/20 flex items-center justify-center">
                    <XCircle className="h-16 w-16 text-rejected" />
                  </div>
                )}
              </div>

              {aiComment && (
                <div className={`p-3 rounded-lg ${status === "verified" ? "bg-verified/10 border border-verified/30" : "bg-rejected/10 border border-rejected/30"}`}>
                  <p className={`text-sm ${haikuMode ? "whitespace-pre-line font-display italic" : ""}`}>{aiComment}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-glass-border flex items-center justify-end gap-2">
          {status === "idle" && imageUrl && (
            <>
              <Button variant="ghost" size="sm" onClick={handleRetry}>Change Photo</Button>
              <Button size="sm" onClick={handleVerify} className="bg-proof-primary text-proof-primary-foreground">
                <Scan className="h-4 w-4 mr-1" /> Submit Proof
              </Button>
            </>
          )}
          {status === "scanning" && (
            <div className="flex items-center gap-2 text-proof-primary">
              <Scan className="h-4 w-4 animate-spin" />
              <span className="text-sm font-display">The AI is judging your life choices...</span>
            </div>
          )}
          {status === "verified" && (
            <Button size="sm" onClick={onClose} className="bg-verified text-verified-foreground">
              <CheckCircle2 className="h-4 w-4 mr-1" /> Quest Complete!
            </Button>
          )}
          {status === "rejected" && (
            <Button size="sm" onClick={handleRetry} className="bg-rejected text-rejected-foreground">
              <RotateCcw className="h-4 w-4 mr-1" /> Try Again (for real this time)
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
