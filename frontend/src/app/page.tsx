"use client";

import { useState, useEffect } from "react";
import AIChatWidget from "@/components/AIChatWidget";
import LoadingOverlay from "@/components/LoadingOverlay";
import { motion } from "framer-motion";
import {
  Heart,
  Mic,
  BarChart3,
  Calendar,
  Sun,
  Moon,
  Flame,
  GraduationCap,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { VoiceRecorder } from "@/components/voice-recorder";
import { MoodCard } from "@/components/mood-card";
import { DailyQuote } from "@/components/daily-quote";
import QuickMoodCheck from "@/components/quick-mood-check";
import { useMoodStore } from "@/store/mood-store";
import { useSleepStore } from "@/store/sleep-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsStore } from "@/store/settings-store";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TopMenu from "@/components/TopMenu";

/* ------------------------------------------------------------------
   🧠 Helper Functions
------------------------------------------------------------------ */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

function getMotivationalMessage(mood: string): string {
  const hour = new Date().getHours();
  const timePeriod =
    hour >= 5 && hour < 12
      ? "morning"
      : hour >= 12 && hour < 17
      ? "afternoon"
      : hour >= 17 && hour < 21
      ? "evening"
      : "night";

  const messages: Record<string, Record<string, string[]>> = {
    happy: {
      morning: ["Start your day with gratitude 🌞", "Your joy fuels others 💖"],
      afternoon: ["Keep spreading positivity 💫", "Stay bright this afternoon!"],
      evening: ["Unwind with gratitude 🌇", "A smile suits the sunset 🌿"],
      night: ["Drift into calm happiness 🌙", "Dream light ✨"],
    },
    default: {
      morning: ["Start your day mindfully 🌅", "Today is full of potential ☀️"],
      afternoon: ["Stay present 🌿", "Your energy shapes your day 💫"],
      evening: ["Reflect gently 🌇", "Peace begins now 🌙"],
      night: ["Close the day with kindness 💜", "Sleep well and renew 🌌"],
    },
  };

  const moodKey = messages[mood.toLowerCase()] ? mood.toLowerCase() : "default";
  const options = messages[moodKey][timePeriod];
  return options[Math.floor(Math.random() * options.length)];
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Let’s start your mindfulness journey today 🌱";
  if (streak === 1) return "Nice! You’ve begun your streak 🔥";
  if (streak > 1 && streak <= 3) return `You're on a ${streak}-day streak 🌸 Keep it up!`;
  if (streak > 3 && streak <= 6) return `🔥 ${streak} days of consistency — amazing focus!`;
  if (streak > 6 && streak <= 10) return `💪 ${streak}-day streak! Your calm habits are growing.`;
  if (streak > 10) return `🌟 Incredible! ${streak} days strong — mindfulness master!`;
  return "Keep going — your peace is building 🌿";
}

/* ------------------------------------------------------------------
   📘 Academic Tasks Preview
------------------------------------------------------------------ */
function AcademicTasksPreview() {
  const [tasks, setTasks] = useState<
    { title: string; due: string; priority: string; completed: boolean }[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("academic_tasks_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      const active = parsed.filter((t: any) => !t.completed);
      setTasks(active);
    }
  }, []);

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🎓 No active academic tasks right now.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 3).map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-white/20 dark:bg-gray-800/40 border-gray-200/20 dark:border-gray-700/40 backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {t.title}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <CalendarDays className="inline w-3 h-3 mr-1" />
                  Due: {t.due}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                  t.priority
                )}`}
              >
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-right">
        <a
          href="/academic-resources"
          className="text-sm font-medium text-purple-400 hover:underline"
        >
          View All →
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   🌈 Dashboard Page with Elegant Glass Theme
------------------------------------------------------------------ */
export default function DashboardPage() {
  const { currentMood, moods } = useMoodStore();
  const { sleepRecords, getAverageSleep, getSleepQualityTrend } = useSleepStore();
  const { darkMode, setDarkMode, fontSize, tracking, language } = useSettingsStore();
  const t = useTranslation();

  // 🟣 Loading overlay control
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const [clientMessage, setClientMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [streakMessage, setStreakMessage] = useState("");

  useEffect(() => {
    const storedStreak = Number(localStorage.getItem("mood_streak")) || 0;
    const lastLoggedDate = localStorage.getItem("last_logged_date");

    if (moods.length > 0) {
      const latestMood = moods[moods.length - 1];
      const latestDate = new Date(latestMood.timestamp).toISOString().split("T")[0];
      const today = new Date().toISOString().split("T")[0];

      if (latestDate === today) {
        setStreak(storedStreak || 1);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastLoggedDate === yesterdayStr) {
          const newStreak = storedStreak + 1;
          setStreak(newStreak);
          localStorage.setItem("mood_streak", String(newStreak));
        } else {
          setStreak(1);
          localStorage.setItem("mood_streak", "1");
        }
      }
      localStorage.setItem("last_logged_date", today);
    }
  }, [moods]);

  useEffect(() => {
    setStreakMessage(getStreakMessage(streak));
  }, [streak]);

  useEffect(() => {
    setClientMessage(getMotivationalMessage(currentMood?.emotion || "default"));
  }, [currentMood]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.lang = language;
  }, [darkMode, language]);

  const fontClass =
    fontSize === "Small" ? "text-sm" : fontSize === "Large" ? "text-lg" : "text-base";

  const averageSleep = getAverageSleep();
  const trend = getSleepQualityTrend();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div
      className={`min-h-screen ${fontClass} transition-all duration-700 ${
        darkMode
          ? "bg-gradient-to-br from-[#0c0221] via-[#1b0542] to-[#2e0a67] text-gray-100"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="border-b bg-white/40 dark:bg-[#12052e]/40 backdrop-blur-2xl shadow-md">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-purple-500 dark:text-purple-300" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("appName") || "MindfulTrack"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-800/50"
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600" />
              )}
            </Button>
            <TopMenu />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container px-4 py-8 mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <Card className="border-0 shadow-lg bg-white/20 dark:bg-[#1d0a3a]/40 backdrop-blur-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-red-500 dark:text-pink-400" />
                  <span>Welcome back!</span>
                </CardTitle>
                <p className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                  {getGreeting()}, Chethu!
                </p>
                <p className="mt-2 italic text-indigo-600 dark:text-indigo-300">
                  {clientMessage}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <QuickMoodCheck />
                  <DailyQuote />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl bg-gradient-to-br from-purple-400/30 via-pink-500/20 to-indigo-500/20 dark:from-[#2b0c57]/80 dark:to-[#150531]/80 backdrop-blur-xl border border-purple-200/30 dark:border-purple-900/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <span>Daily Mindfulness Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <p className="text-5xl font-extrabold text-orange-600 dark:text-yellow-300">
                  {streak}
                </p>
                <p className="mt-1 text-sm text-gray-800 dark:text-gray-100">{streakMessage}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Academic Tasks */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg bg-white/20 dark:bg-[#1d0a3a]/40 backdrop-blur-xl border border-purple-200/30 dark:border-purple-800/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                  <span>Academic Tasks Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AcademicTasksPreview />
              </CardContent>
            </Card>
          </motion.div>

          {/* Voice Recorder */}
          {tracking.mood && (
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg bg-white/20 dark:bg-[#1d0a3a]/40 backdrop-blur-xl border border-purple-200/30 dark:border-purple-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Mic className="w-6 h-6 text-blue-400" />
                    <span>Voice Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VoiceRecorder />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Current Mood */}
          {tracking.mood && (
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg bg-white/20 dark:bg-[#1d0a3a]/40 backdrop-blur-xl border border-purple-200/30 dark:border-purple-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                    <span>Current Mood</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodCard mood={currentMood} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Smart Sleep Tracker */}
          {tracking.sleep && (
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Card className="shadow-lg bg-white/20 dark:bg-[#1d0a3a]/40 backdrop-blur-xl border border-purple-200/30 dark:border-purple-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                    <span>Smart Sleep Tracker</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sleepRecords.length === 0 ? (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      No sleep data detected yet.
                    </p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={sleepRecords.slice(-7)}>
                          <XAxis dataKey="date" stroke={darkMode ? "#e5e7eb" : "#374151"} />
                          <YAxis stroke={darkMode ? "#e5e7eb" : "#374151"} />
                          <Tooltip />
                          <Bar dataKey="duration" fill={darkMode ? "#8b5cf6" : "#6366f1"} />
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="mt-4 text-sm text-gray-800 dark:text-gray-100">
                        💤 Average Sleep:{" "}
                        <span className="font-semibold text-indigo-400">{averageSleep} hrs</span> –{" "}
                        <span
                          className={`${
                            trend === "Improving"
                              ? "text-green-400"
                              : trend === "Declining"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {trend}
                        </span>
                      </p>
                    </> 
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* 🌙 Loading & AI Widget */}
      {isLoading && <LoadingOverlay />}
      <AIChatWidget />
    </div>
  );
}
