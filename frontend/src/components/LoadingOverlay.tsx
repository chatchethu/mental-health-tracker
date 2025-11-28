"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center 
        bg-gradient-to-br from-purple-800/30 via-indigo-900/40 to-gray-900/40 
        backdrop-blur-2xl text-center select-none"
    >
      {/* 🌈 Elegant Animated Loader */}
      <motion.div
        className="relative w-16 h-16"
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "linear",
        }}
      >
        <div
          className="absolute inset-0 rounded-full border-4 
            border-t-transparent border-b-transparent 
            border-purple-400 animate-pulse shadow-[0_0_20px_#a855f7]"
        ></div>
        <div
          className="absolute border-4 border-transparent rounded-full inset-2 border-t-purple-500 border-b-purple-600 blur-sm opacity-60"
        ></div>
      </motion.div>

      {/* 🌤 Motivational Message */}
      {showText && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 text-lg font-medium text-purple-100 drop-shadow-sm"
        >
          You’ve got this — <span className="text-yellow-300">one moment at a time 🌤</span>
        </motion.p>
      )}
    </motion.div>
  );
}
