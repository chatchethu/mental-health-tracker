// src/types/index.ts

// =========================
// 👤 User-related Interfaces
// =========================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// 😊 Mood & Emotion Types
// =========================
export type EmotionType =
  | "amazing"
  | "great"
  | "good"
  | "okay"
  | "low"
  | "struggling"
  | "happy"
  | "sad"
  | "angry"
  | "calm"
  | "anxious"
  | "excited"
  | "neutral"
  | "frustrated"
  | "confident"
  | "lonely";

export interface Mood {
  id: string;
  userId: string;
  emotion: EmotionType;
  intensity: number; // 1–10
  notes?: string;
  audioUrl?: string;
  transcription?: string;
  aiAnalysis?: AIAnalysis;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// 🤖 AI & Voice Interfaces
// =========================
export interface AIAnalysis {
  detectedEmotion: EmotionType;
  confidence: number;
  sentiment: "positive" | "negative" | "neutral";
  keywords: string[];
  suggestions: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface VoiceRecording {
  blob: Blob;
  url: string;
  duration: number;
  isRecording: boolean;
}

// =========================
// 📊 Insights & Chart Data
// =========================
export interface MoodInsight {
  date: string;
  avgIntensity: number;
  dominantEmotion: EmotionType;
  emotionalVariability: number;
  positiveMentions: number;
  negativeMentions: number;
}

export interface MoodChartData {
  date: string;
  mood: EmotionType;
  intensity: number;
  sentiment: number;
}

// =========================
// ⚡ Quick Mood Structure
// =========================
export interface QuickMood {
  emotion: EmotionType;
  icon: string;
  color: string;
  label: string;
}

// =========================
// 💬 Daily Quote Interface
// =========================
export interface DailyQuote {
  text: string;
  author: string;
  category: "motivation" | "mindfulness" | "self-care" | "growth";
}

// =========================
// 🔔 Notification Settings
// =========================
export interface NotificationSettings {
  dailyReminders: boolean;
  reminderTime: string;
  weeklyReports: boolean;
  moodAlerts: boolean;
  emergencyContacts: string[];
}

// =========================
// ⚙️ App Settings
// =========================
export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: NotificationSettings;
  privacy: {
    shareData: boolean;
    anonymizeData: boolean;
    retentionDays: number;
  };
}
