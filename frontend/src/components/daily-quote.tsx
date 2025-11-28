"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DailyQuote as DailyQuoteType } from "@/types";
import toast from "react-hot-toast";

const quotes: DailyQuoteType[] = [
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein",
    category: "motivation",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation",
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "growth",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "mindfulness",
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "mindfulness",
  },
  {
    text: "You don’t have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
    category: "mindfulness",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    text: "Growth begins at the end of your comfort zone.",
    author: "Roy T. Bennett",
    category: "growth",
  },
  {
    text: "Self-care is not a luxury. It’s a necessity for a healthy and meaningful life.",
    author: "Unknown",
    category: "self-care",
  },
  {
    text: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    category: "motivation",
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "growth",
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay",
    category: "self-care",
  },
  {
    text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thich Nhat Hanh",
    category: "mindfulness",
  },
  {
    text: "You are not your thoughts. You are the observer of your thoughts.",
    author: "Eckhart Tolle",
    category: "mindfulness",
  },
  {
    text: "Don’t watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "motivation",
  },
  {
    text: "The secret of change is to focus all your energy not on fighting the old, but on building the new.",
    author: "Socrates",
    category: "growth",
  },
  {
    text: "It’s not the load that breaks you down, it’s the way you carry it.",
    author: "Lou Holtz",
    category: "self-care",
  },
  {
    text: "You are stronger than you think, braver than you believe, and smarter than you know.",
    author: "A.A. Milne",
    category: "growth",
  },
  {
    text: "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.",
    author: "Unknown",
    category: "self-care",
  },
  {
    text: "The greatest discovery of all time is that a person can change his future by merely changing his attitude.",
    author: "Oprah Winfrey",
    category: "growth",
  },
  {
    text: "You were given this life because you are strong enough to live it.",
    author: "Unknown",
    category: "motivation",
  },
  {
    text: "You can’t stop the waves, but you can learn to surf.",
    author: "Jon Kabat-Zinn",
    category: "mindfulness",
  },
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
    category: "motivation",
  },
  {
    text: "You will never always be motivated, so you must learn to be disciplined.",
    author: "Unknown",
    category: "growth",
  },
];

export function DailyQuote() {
  const [quote, setQuote] = useState<DailyQuoteType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDailyQuote = () => {
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
      );
      const quoteIndex = dayOfYear % quotes.length;
      setQuote(quotes[quoteIndex]);
    };

    getDailyQuote();
  }, []);

  const refreshQuote = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setIsLoading(false);
      toast.success("New quote loaded!");
    }, 500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "motivation":
        return "🚀";
      case "mindfulness":
        return "🧘";
      case "self-care":
        return "💝";
      case "growth":
        return "🌱";
      default:
        return "✨";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "motivation":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "mindfulness":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "self-care":
        return "text-pink-600 bg-pink-50 border-pink-200";
      case "growth":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (!quote) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <Sparkles className="w-8 h-8 text-gray-400 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Daily Inspiration</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshQuote}
              disabled={isLoading}
              className="w-8 h-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Quote Content */}
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <blockquote className="text-lg italic leading-relaxed text-gray-700 dark:text-gray-300">
              "{quote.text}"
            </blockquote>

            <div className="flex items-center justify-between">
              <cite className="text-sm not-italic text-gray-600 dark:text-gray-400">
                — {quote.author}
              </cite>

              <div
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                  quote.category
                )}`}
              >
                <span className="mr-1">{getCategoryIcon(quote.category)}</span>
                {quote.category}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex pt-2 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.share &&
                  navigator.share({
                    title: "Daily Inspiration",
                    text: `"${quote.text}" — ${quote.author}`,
                  });
              }}
              className="flex-1 text-xs"
            >
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
                toast.success("Quote copied to clipboard!");
              }}
              className="flex-1 text-xs"
            >
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
