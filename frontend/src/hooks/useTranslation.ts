"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settings-store";

// ✅ Import translation files
import en from "@/i18n/en.json";
import hi from "@/i18n/hi.json";
import kn from "@/i18n/kn.json";
import ta from "@/i18n/ta.json";

type LanguageCode = "en" | "hi" | "kn" | "ta";
type Translations = Record<string, string>;

// ✅ Combine all language files into one object
const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en,
  hi,
  kn,
  ta,
};

/**
 * ✅ useTranslation Hook
 * Dynamically provides translation strings based on current language from Zustand.
 */
export function useTranslation() {
  const { language } = useSettingsStore(); // Zustand store value
  const [currentLang, setCurrentLang] = useState<LanguageCode>(
    (language as LanguageCode) || "en"
  );

  // ✅ Update language dynamically when Zustand store changes
  useEffect(() => {
    setCurrentLang(language as LanguageCode);
  }, [language]);

  /**
   * ✅ Translation function (t)
   * Fetches the translated value for a given key.
   * Falls back to English if not found.
   */
  const t = (key: string): string => {
    const selected = TRANSLATIONS[currentLang];
    if (selected && selected[key]) return selected[key];

    // Fallback to English if key missing
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];

    // If not found in English, return key name for debugging
    return key;
  };

  return t;
}
