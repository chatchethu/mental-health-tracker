"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { meditations } from "../data";
import { motion } from "framer-motion";
import { Play, Pause, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeditationPlayer() {
  const { id } = useParams();
  const router = useRouter();
  const meditation = meditations.find((m) => m.id === id);

  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!meditation) return;
    const audio = new Audio(meditation.audioUrl);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    if (playing) audio.play().catch(() => {});
    else audio.pause();

    return () => audio.pause();
  }, [playing, meditation]);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [playing]);

  if (!meditation)
    return (
      <div className="p-6 text-center text-gray-600">
        Meditation not found.
        <Button onClick={() => router.push("/resources/guided-meditation")} className="ml-3">
          Go Back
        </Button>
      </div>
    );

  const progress = (elapsed / (meditation.durationMins * 60)) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fde1ec] via-[#f9f0ff] to-[#e6f4ff] dark:from-gray-900 dark:to-pink-900 p-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="absolute text-gray-700 top-6 left-6 dark:text-gray-300"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg text-center"
      >
        <img
          src={meditation.imageUrl}
          alt={meditation.title}
          className="object-cover w-full shadow-lg rounded-2xl h-60"
        />
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          {meditation.title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {meditation.instructor} • {meditation.category} • {meditation.difficulty}
        </p>

        <motion.div
          className="relative flex items-center justify-center mt-8"
          animate={{ scale: playing ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 4, repeat: playing ? Infinity : 0, ease: "easeInOut" }}
        >
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(200,200,200,0.3)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#ec4899"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (progress / 100) * 283}
              transition={{ duration: 0.4 }}
            />
          </svg>
          <Button
            onClick={() => setPlaying((p) => !p)}
            className="absolute p-6 text-white bg-pink-500 rounded-full shadow-lg hover:bg-pink-600"
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
        </motion.div>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")} /{" "}
          {meditation.durationMins}:00
        </p>
      </motion.div>
    </div>
  );
}
