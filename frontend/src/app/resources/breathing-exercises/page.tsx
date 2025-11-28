"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Pause,
  Play,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const phases = [
  { name: "Inhale", duration: 4000, message: "Breathe in deeply 🌿" },
  { name: "Hold", duration: 3000, message: "Hold your breath... 💫" },
  { name: "Exhale", duration: 4000, message: "Slowly exhale 🌬️" },
];

export default function BreathingExercises() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const phase = phases[phaseIndex];
  const maxDuration = 60; // ⏱️ 1 minute

  // 🌬️ Breathing cycle
  useEffect(() => {
    if (!isPlaying || sessionComplete) return;

    intervalRef.current = setTimeout(() => {
      if (phaseIndex === phases.length - 1) {
        setPhaseIndex(0);
        setSessionCount((s) => s + 1);
      } else {
        setPhaseIndex((i) => i + 1);
      }
    }, phase.duration);

    return () => clearTimeout(intervalRef.current!);
  }, [phaseIndex, isPlaying, sessionComplete]);

  // ⏳ Track elapsed time
  useEffect(() => {
    if (isPlaying && !sessionComplete) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= maxDuration) {
            handleSessionComplete();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current!);
    }
    return () => clearInterval(timerRef.current!);
  }, [isPlaying, sessionComplete]);

  const handleSessionComplete = () => {
    setSessionComplete(true);
    setIsPlaying(false);
    clearTimeout(intervalRef.current!);
    clearInterval(timerRef.current!);
  };

  const handleRestart = () => {
    setPhaseIndex(0);
    setSessionCount(0);
    setElapsed(0);
    setSessionComplete(false);
    setHasStarted(false);
    setIsPlaying(false);
  };

  const startExercise = () => {
    setHasStarted(true);
    setIsPlaying(true);
  };

  const bgGradient =
    phase.name === "Inhale"
      ? "from-blue-100 to-cyan-200 dark:from-gray-900 dark:to-blue-900"
      : phase.name === "Hold"
      ? "from-teal-100 to-emerald-200 dark:from-gray-900 dark:to-teal-900"
      : "from-purple-100 to-pink-200 dark:from-gray-900 dark:to-purple-900";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all duration-1000 bg-gradient-to-br ${bgGradient}`}
    >
      {!hasStarted ? (
        // 🟢 Start Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <Wind className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400 animate-pulse" />
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Guided Breathing
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Relax your body and mind before you begin 🌿
          </p>
          <Button
            onClick={startExercise}
            className="px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Start Breathing Exercise
          </Button>
        </motion.div>
      ) : !sessionComplete ? (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <Wind className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Guided Breathing
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Follow the rhythm — {phase.message}
            </p>
          </motion.div>

          {/* 🌕 Breathing Face Animation */}
          <BreathingFace phase={phase.name} />

          {/* Current Phase */}
          <AnimatePresence mode="wait">
            <motion.p
              key={phase.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 text-2xl font-semibold text-gray-800 dark:text-gray-200"
            >
              {phase.name}
            </motion.p>
          </AnimatePresence>

          {/* Timer */}
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Session #{sessionCount + 1} • {elapsed}s / 60s
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 text-white bg-blue-600 hover:bg-blue-700"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Resume
                </>
              )}
            </Button>

            <Button
              onClick={handleRestart}
              variant="outline"
              className="flex items-center gap-2 border-gray-400 dark:border-gray-600"
            >
              <RefreshCcw className="w-4 h-4" /> Restart
            </Button>
          </div>
        </>
      ) : (
        // ✅ Session Complete
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <CheckCircle2 className="w-16 h-16 mb-4 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Session Complete
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            You’ve completed a 1-minute breathing exercise 🌿
          </p>
          <Button
            onClick={handleRestart}
            className="mt-6 text-white bg-blue-600 hover:bg-blue-700"
          >
            Start New Session
          </Button>
        </motion.div>
      )}
    </div>
  );
}

/* 🧘 Animated Face Component */
function BreathingFace({ phase }: { phase: string }) {
  const isInhale = phase === "Inhale";
  const isExhale = phase === "Exhale";

  return (
    <motion.div
      animate={{
        scale: isInhale ? 1.3 : isExhale ? 0.9 : 1,
        opacity: isExhale ? 0.9 : 1,
      }}
      transition={{ duration: 3 }}
      className="relative flex items-center justify-center w-48 h-48 rounded-full shadow-lg bg-gradient-to-br from-yellow-50 to-blue-100 dark:from-gray-700 dark:to-gray-600"
    >
      {/* Emoji Face */}
      <motion.div
        animate={{ y: isExhale ? 6 : 0 }}
        transition={{ duration: 1 }}
        className="text-5xl leading-none text-gray-700 dark:text-white"
      >
        {isInhale ? "🙂" : isExhale ? "😌" : "😐"}
      </motion.div>

      {/* Soft Glow */}
      <motion.div
        className="absolute inset-0 bg-blue-300 rounded-full opacity-50 blur-2xl dark:bg-blue-800"
        animate={{
          scale: isInhale ? 1.5 : 1,
          opacity: isInhale ? 0.4 : 0.2,
        }}
        transition={{ duration: 4 }}
      />
    </motion.div>
  );
}
