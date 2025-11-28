"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Globe, HeartPulse, ArrowLeft, Trash2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { useSettingsStore } from "@/store/settings-store";
import { useMoodStore } from "@/store/mood-store";
import { useSleepStore } from "@/store/sleep-store";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const {
    darkMode,
    setDarkMode,
    fontSize,
    setFontSize,
    tracking,
    setTracking,
    language,
    setLanguage,
    resetSettings,
  } = useSettingsStore();

  const { resetMoods } = useMoodStore();
  const { resetSleep } = useSleepStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.4 },
    },
  });

  const handleResetAll = () => {
    const confirmed = confirm("Reset ALL data? This action cannot be undone.");
    if (!confirmed) return;

    try {
      localStorage.clear();
      resetSettings();
      resetMoods();
      resetSleep();
      toast.success("All data cleared successfully!");

      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (err) {
      toast.error("Failed to reset");
    }
  };

  const filteredTracking = Object.fromEntries(
    Object.entries(tracking).filter(
      ([key]) => !["exercise", "diet", "medication", "stress"].includes(key)
    )
  );

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-purple-900 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl px-4 py-10 mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold">⚙️ Settings</h1>

          {/* Button to go to login page */}
          <Link href="/login">
            <Button className="text-white bg-purple-600 hover:bg-purple-700">
              Login / Signup
            </Button>
          </Link>
        </div>

        {/* Appearance */}
        <motion.div variants={fadeIn(0.1)} initial="hidden" animate="visible">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-500" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between">
                <span>Font Size</span>
                <div className="flex gap-2">
                  {["Small", "Medium", "Large"].map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? "default" : "outline"}
                      onClick={() => setFontSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language */}
        <motion.div variants={fadeIn(0.2)} initial="hidden" animate="visible">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" /> Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="kn">Kannada</option>
                <option value="ta">Tamil</option>
              </select>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tracking */}
        <motion.div variants={fadeIn(0.3)} initial="hidden" animate="visible">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-500" /> Tracking Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(filteredTracking).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between capitalize">
                  <span>{key}</span>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setTracking({ ...tracking, [key]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Reset */}
        <motion.div variants={fadeIn(0.4)} initial="hidden" animate="visible">
          <Button
            onClick={handleResetAll}
            className="text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset All Data
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
