import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TrackingSettings {
  mood: boolean;
  sleep: boolean;
  exercise: boolean;
  diet: boolean;
  medication: boolean;
  stress: boolean;
}

interface SettingsState {
  darkMode: boolean;
  fontSize: string;
  language: string;
  notifications: boolean;
  tracking: TrackingSettings;

  setDarkMode: (value: boolean) => void;
  setFontSize: (size: string) => void;
  setLanguage: (lang: string) => void;
  setTracking: (tracking: TrackingSettings) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      fontSize: "Medium",
      language: "en",
      notifications: true,
      tracking: {
        mood: true,
        sleep: true, // 💤 default ON
        exercise: false,
        diet: false,
        medication: false,
        stress: false,
      },

      setDarkMode: (value) => set({ darkMode: value }),
      setFontSize: (size) => set({ fontSize: size }),
      setLanguage: (lang) => set({ language: lang }),
      setTracking: (tracking) => set({ tracking }),

      resetSettings: () =>
        set({
          darkMode: false,
          fontSize: "Medium",
          language: "en",
          notifications: true,
          tracking: {
            mood: true,
            sleep: true,
            exercise: false,
            diet: false,
            medication: false,
            stress: false,
          },
        }),
    }),
    { name: "settings-store" }
  )
);
