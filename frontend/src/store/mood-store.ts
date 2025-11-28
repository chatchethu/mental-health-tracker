import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Mood, EmotionType, MoodChartData } from "@/types";

interface AiAnalysis {
  detectedEmotion: string;
  confidence: number;
  sentiment?: string;
  keywords?: string[];
  suggestions?: string[];
  riskLevel?: string;
}

interface MoodState {
  moods: Mood[];
  currentMood: Mood | null;
  loading: boolean;
  error: string | null;
  moodStreak: number;
  lastLoggedDate: string | null;

  addMood: (mood: Omit<Mood, "id" | "createdAt" | "updatedAt">) => void;
  updateMood: (id: string, updates: Partial<Mood>) => void;
  deleteMood: (id: string) => void;
  setCurrentMood: (mood: Mood | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetMoods: () => void;
  resetStreak: () => void;

  getMoodTrends: (days: number) => MoodChartData[];
  getEmotionFrequency: () => Record<EmotionType, number>;
  getAverageIntensity: (days?: number) => number;
  getWeeklyInsights: () => any;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      moods: [],
      currentMood: null,
      loading: false,
      error: null,
      moodStreak: 0,
      lastLoggedDate: null,

      addMood: (moodData) => {
        const newMood: Mood = {
          ...moodData,
          id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const state = get();
        const today = new Date().toDateString();
        const lastLogged = state.lastLoggedDate;
        let newStreak = state.moodStreak;

        if (!lastLogged) newStreak = 1;
        else {
          const lastDate = new Date(lastLogged);
          const diffInDays =
            (new Date(today).getTime() - lastDate.getTime()) /
            (1000 * 3600 * 24);

          if (diffInDays >= 1 && diffInDays < 2) newStreak += 1;
          else if (diffInDays >= 2) newStreak = 1;
        }

        set((state) => ({
          moods: [newMood, ...state.moods],
          currentMood: newMood,
          moodStreak: newStreak,
          lastLoggedDate: today,
          error: null,
        }));

        console.log(
          `🎯 Mood added: ${newMood.emotion} | 🔥 Streak: ${newStreak} day(s)`
        );
      },

      updateMood: (id, updates) =>
        set((state) => ({
          moods: state.moods.map((mood) =>
            mood.id === id
              ? { ...mood, ...updates, updatedAt: new Date() }
              : mood
          ),
          currentMood:
            state.currentMood?.id === id
              ? { ...state.currentMood, ...updates, updatedAt: new Date() }
              : state.currentMood,
        })),

      deleteMood: (id) =>
        set((state) => ({
          moods: state.moods.filter((m) => m.id !== id),
          currentMood: state.currentMood?.id === id ? null : state.currentMood,
        })),

      setCurrentMood: (mood) => set({ currentMood: mood }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      resetMoods: () => {
        set({ moods: [], currentMood: null, moodStreak: 0, lastLoggedDate: null });
        console.log("🧹 All mood data cleared");
      },

      resetStreak: () => set({ moodStreak: 0, lastLoggedDate: null }),

      getMoodTrends: (days = 7) => {
        const { moods } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const filtered = moods
          .filter((m) => new Date(m.timestamp) >= cutoffDate)
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

        return filtered.map((m) => ({
          date: new Date(m.timestamp).toLocaleDateString(),
          mood: m.emotion,
          intensity: m.intensity,
          sentiment: getSentimentValue(m.emotion),
        }));
      },

      getEmotionFrequency: () => {
        const { moods } = get();
        const freq: Record<EmotionType, number> = {} as Record<
          EmotionType,
          number
        >;
        moods.forEach((m) => {
          freq[m.emotion] = (freq[m.emotion] || 0) + 1;
        });
        return freq;
      },

      getAverageIntensity: (days = 7) => {
        const { moods } = get();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const filtered = moods.filter((m) => new Date(m.timestamp) >= cutoff);
        if (filtered.length === 0) return 0;

        const total = filtered.reduce((sum, m) => sum + m.intensity, 0);
        return total / filtered.length;
      },

      getWeeklyInsights: () => {
        const trends = get().getMoodTrends(7);
        const freq = get().getEmotionFrequency();
        const avgIntensity = get().getAverageIntensity(7);

        const mostFrequentEmotion = Object.entries(freq).sort(([, a], [, b]) => b - a)[0]?.[0] as EmotionType;

        const positiveDays = trends.filter((t) => t.sentiment > 0).length;
        const negativeDays = trends.filter((t) => t.sentiment < 0).length;

        return {
          averageIntensity: avgIntensity,
          mostFrequentEmotion,
          positiveDays,
          negativeDays,
          totalEntries: trends.length,
          moodStability: calculateMoodStability(trends),
        };
      },
    }),
    {
      name: "mood-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        moods: state.moods,
        currentMood: state.currentMood,
        moodStreak: state.moodStreak,
        lastLoggedDate: state.lastLoggedDate,
      }),
    }
  )
);

/* ---------- 🧠 Helper Functions ---------- */

function getSentimentValue(emotion: EmotionType): number {
  const map: Partial<Record<EmotionType, number>> = {
    happy: 2,
    excited: 2,
    amazing: 2,
    great: 1.5,
    good: 1,
    confident: 1,
    calm: 0.5,
    okay: 0.25,
    neutral: 0,
    anxious: -0.5,
    sad: -1,
    frustrated: -1.5,
    angry: -2,
    lonely: -1.5,
  };
  return map[emotion] ?? 0;
}

function calculateMoodStability(trends: MoodChartData[]): number {
  if (trends.length < 2) return 100;
  const sentiments = trends.map((t) => t.sentiment);
  const mean = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  const variance =
    sentiments.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    sentiments.length;
  const std = Math.sqrt(variance);
  return Math.max(0, Math.round(100 - (std / 2) * 100));
}
