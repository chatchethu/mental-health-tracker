import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SleepData {
  date: string;
  duration: number;
  quality: "Excellent" | "Good" | "Moderate" | "Poor";
}

interface SleepState {
  sleepRecords: SleepData[];
  calculateSleepDuration: (timestamps: (string | Date)[]) => void;
  getAverageSleep: () => number;
  getSleepQualityTrend: () => string;
  resetSleep: () => void;
}

export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      sleepRecords: [],

      calculateSleepDuration: (timestamps: (string | Date)[]) => {
        if (timestamps.length < 2) return;
        const sorted = timestamps
          .map((t) => new Date(t))
          .sort((a, b) => a.getTime() - b.getTime());

        const last = sorted[sorted.length - 1];
        const prev = sorted[sorted.length - 2];
        const diffHours = (last.getTime() - prev.getTime()) / (1000 * 60 * 60);

        if (diffHours >= 4 && diffHours <= 10) {
          const dateKey = last.toLocaleDateString();
          const existing = get().sleepRecords.find((r) => r.date === dateKey);
          if (existing) return;

          let quality: SleepData["quality"];
          if (diffHours >= 8) quality = "Excellent";
          else if (diffHours >= 6.5) quality = "Good";
          else if (diffHours >= 5) quality = "Moderate";
          else quality = "Poor";

          const record: SleepData = {
            date: dateKey,
            duration: Number(diffHours.toFixed(1)),
            quality,
          };

          set((state) => ({
            sleepRecords: [...state.sleepRecords, record],
          }));
        }
      },

      getAverageSleep: () => {
        const records = get().sleepRecords;
        if (records.length === 0) return 0;
        const total = records.reduce((a, b) => a + b.duration, 0);
        return Number((total / records.length).toFixed(1));
      },

      getSleepQualityTrend: () => {
        const records = get().sleepRecords;
        if (records.length < 2) return "Stable";

        const [prev, last] = records.slice(-2);
        if (last.duration > prev.duration) return "Improving";
        if (last.duration < prev.duration) return "Declining";
        return "Stable";
      },

      resetSleep: () => {
        set({ sleepRecords: [] });
        console.log("🧹 Sleep data cleared");
      },
    }),
    { name: "mindfultrack-sleep" }
  )
);
