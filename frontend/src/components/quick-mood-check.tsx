"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useMoodStore } from "@/store/mood-store";
import { EmotionType, QuickMood } from "@/types";
import { getEmotionEmoji, getEmotionGradient } from "@/lib/utils";
import toast from "react-hot-toast";

// ✅ Added color for type safety
const quickMoods: QuickMood[] = [
  { emotion: "amazing", icon: "🤩", label: "Amazing", color: "yellow" },
  { emotion: "great", icon: "😄", label: "Great", color: "green" },
  { emotion: "good", icon: "😊", label: "Good", color: "blue" },
  { emotion: "okay", icon: "🙂", label: "Okay", color: "gray" },
  { emotion: "low", icon: "😔", label: "Low", color: "purple" },
  { emotion: "struggling", icon: "😣", label: "Struggling", color: "red" },
];

function QuickMoodCheck() {
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addMood, setLoading } = useMoodStore();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select how you're feeling");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const aiAnalysis = await mockAIAnalysis(selectedMood, notes);

      addMood({
        userId: "user_1",
        emotion: selectedMood,
        intensity,
        notes: notes.trim() || undefined,
        aiAnalysis,
        timestamp: new Date(),
      });

      toast.success("Mood tracked successfully!");
      setSelectedMood(null);
      setIntensity(5);
      setNotes("");
    } catch {
      toast.error("Failed to save mood. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // ✅ FIXED: Type-safe AI mock analysis
  const mockAIAnalysis = async (emotion: EmotionType, notes: string) => {
    await new Promise((r) => setTimeout(r, 500));

    const sentimentMap: Record<string, "positive" | "neutral" | "negative"> = {
      amazing: "positive",
      great: "positive",
      good: "positive",
      okay: "neutral",
      low: "negative",
      struggling: "negative",
    };

    const riskLevels: Record<string, "low" | "medium" | "high"> = {
      amazing: "low",
      great: "low",
      good: "low",
      okay: "medium",
      low: "medium",
      struggling: "high",
    };

    // ✅ Type-safe access with fallback
    const sentiment =
      sentimentMap[emotion as keyof typeof sentimentMap] || "neutral";
    const riskLevel =
      riskLevels[emotion as keyof typeof riskLevels] || "low";

    return {
      detectedEmotion: emotion,
      confidence: 0.85 + Math.random() * 0.15,
      sentiment,
      riskLevel,
      keywords: notes
        ? notes.toLowerCase().split(" ").filter((w) => w.length > 3).slice(0, 3)
        : [emotion, "mood", "tracking"],
      suggestions: ["Stay mindful 🌿", "Celebrate your feelings 💫"],
    };
  };

  const getIntensityColor = (v: number) => {
    if (v <= 3) return "#22c55e";
    if (v <= 6) return "#eab308";
    if (v <= 8) return "#f97316";
    return "#ef4444";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 text-center border shadow-lg rounded-3xl bg-white/10 dark:bg-white/10 backdrop-blur-2xl border-white/20"
    >
      <div className="mb-5 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          How are you feeling?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Select your current mood below 👇
        </p>
      </div>

      {/* Mood Buttons */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-3 mb-4 sm:grid-cols-6"
      >
        {quickMoods.map((mood) => (
          <motion.button
            key={mood.emotion}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood.emotion)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border 
              ${
                selectedMood === mood.emotion
                  ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)] border-transparent"
                  : "bg-white/10 hover:bg-white/20 border border-white/30 text-gray-900 dark:text-white/90"
              }`}
          >
            <span className="text-3xl">{mood.icon}</span>
            <span
              className={`mt-2 text-sm font-medium ${
                selectedMood === mood.emotion
                  ? "text-white"
                  : "text-gray-800 dark:text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]"
              }`}
            >
              {mood.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Intensity */}
      {selectedMood && (
        <motion.div variants={itemVariants} className="mt-4 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Intensity
            </span>
            <Badge
              variant="outline"
              className="text-gray-800 border border-white/30 dark:text-gray-100 bg-white/10"
            >
              {intensity}/10
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Mild</span>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${getIntensityColor(
                  intensity
                )} ${intensity * 10}%, #e5e7eb ${intensity * 10}%)`,
              }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">Strong</span>
          </div>
        </motion.div>
      )}

      {/* Notes */}
      {selectedMood && (
        <motion.div variants={itemVariants} className="mt-4 space-y-2 text-left">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Notes (optional)
          </label>
          <Textarea
            placeholder="What's on your mind?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-gray-900 border resize-none bg-white/10 border-white/20 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            rows={3}
          />
        </motion.div>
      )}

      {/* Save Mood */}
      {selectedMood && (
        <motion.div variants={itemVariants} className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 text-lg font-semibold text-white transition-all duration-300 shadow-lg rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 hover:shadow-violet-500/30"
          >
            {isSubmitting ? "Saving..." : "💾 Save Mood"}
          </Button>
        </motion.div>
      )}

      {/* Mood Preview */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-2xl bg-gradient-to-r ${getEmotionGradient(
            selectedMood
          )} text-white shadow-md`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">{getEmotionEmoji(selectedMood)}</span>
            <div>
              <div className="font-semibold capitalize">{selectedMood}</div>
              <div className="text-sm opacity-90">Intensity: {intensity}/10</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default QuickMoodCheck;
