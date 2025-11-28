"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Clock, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopMenu from "@/components/TopMenu";

type VideoTrack = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
};

const TRACKS: VideoTrack[] = [
  {
    id: 1,
    title: "Breath by Breath – Relaxing with Our Life",
    artist: "Mindful Souls",
    duration: "19:04",
    videoUrl: "https://youtu.be/9lh_becOt4Y?si=ahHJ90HETfv84sbZ",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Evening Calm – End Your Day in Peace",
    artist: "Tranquil Heart",
    duration: "15:42",
    videoUrl: "https://youtu.be/8wLwxmjrZj8?si=wdmpYy9NAJjGim3C",
    thumbnail:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Collecting and Quieting the Mind",
    artist: "Peace Pathway",
    duration: "17:02",
    videoUrl: "https://youtu.be/lkkGlVWvkLk?si=bWNzC6JX87knzDgZ",
    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Grounded Peace and Stillness",
    artist: "Calm Collective",
    duration: "12:55",
    videoUrl: "https://youtu.be/mr8GBzTsWqM?si=SCKfrnEZYFRqFhki",
    thumbnail:
      "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Opening the Heart – Loving Awareness",
    artist: "Dr. Mindful",
    duration: "13:20",
    videoUrl: "https://youtu.be/picGOKRr4-0?si=vQpzFz7aBkizx_nS",
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Body Scan for Stress Relief",
    artist: "Zen Harmony",
    duration: "16:45",
    videoUrl: "https://youtu.be/9hWgA7qjK2c?si=1vboGTDyOywrcdpC",
    thumbnail:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Relaxing Flow Meditation",
    artist: "Ocean Soul",
    duration: "14:58",
    videoUrl: "https://youtu.be/ySL3NllIhfA?si=fWGme7LxgIVHgu8q",
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Peaceful Breath Meditation",
    artist: "Breathe Well Studio",
    duration: "11:30",
    videoUrl: "https://youtu.be/0IjAs-G1AOc?si=VUwls_t-KRdkcaBq",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Serene Mind Journey",
    artist: "Aura Calm",
    duration: "10:45",
    videoUrl: "https://youtu.be/lE6RYpe9IT0?si=-HDzZyh_p3LBDYNy",
    thumbnail:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Tranquil Deep Sleep",
    artist: "Sleep Therapy",
    duration: "20:10",
    videoUrl: "https://youtu.be/tAIiXRZNh9E?si=9nw5aXHlHU8uuETk",
    thumbnail:
      "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=600&auto=format&fit=crop",
  },
];

export default function RelaxingSoundsPage() {
  const [playing, setPlaying] = useState<number | null>(null);

  const handlePlay = (id: number, videoUrl: string) => {
    if (playing === id) {
      setPlaying(null);
    } else {
      setPlaying(id);
      window.open(videoUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen transition-all duration-700 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
      {/* 🔝 Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 shadow-sm bg-white/80 dark:bg-gray-900/70 backdrop-blur-md dark:border-gray-700">
        <div className="flex items-center justify-between max-w-6xl px-6 py-4 mx-auto">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            🎵 Relaxing Soundscapes
          </h1>
          <TopMenu />
        </div>
      </header>

      {/* 🧘 Main Section */}
      <main className="max-w-6xl px-6 py-10 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-3xl font-bold text-center text-gray-800 dark:text-gray-100"
        >
          Calm • Focus • Heal • Sleep
        </motion.h2>

        {/* 🎧 Grid of Tracks */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="overflow-hidden transition-all border-0 shadow-lg rounded-2xl bg-white/80 hover:shadow-2xl dark:bg-gray-800/80 backdrop-blur-lg"
            >
              <div className="relative">
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="object-cover w-full h-48"
                />
                <button
                  onClick={() => handlePlay(track.id, track.videoUrl)}
                  className="absolute inset-0 flex items-center justify-center transition-opacity bg-black/40 hover:bg-black/60"
                >
                  {playing === track.id ? (
                    <Pause className="w-12 h-12 p-2 text-red-500 rounded-full bg-white/90" />
                  ) : (
                    <Play className="w-12 h-12 p-2 text-red-500 rounded-full bg-white/90" />
                  )}
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {track.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {track.artist}
                </p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {track.duration}
                  </span>
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <Button
                  onClick={() => handlePlay(track.id, track.videoUrl)}
                  className="w-full mt-4 font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600"
                >
                  Watch on YouTube
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-center text-gray-500 dark:text-gray-400">
          Showing {TRACKS.length} relaxing sessions
        </p>
      </main>
    </div>
  );
}
