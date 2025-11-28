"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  Star,
  Heart,
  HeartOff,
  Youtube,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 🧘 Meditation Data (custom images mapped to your uploads)
const meditations = [
  {
    id: "self-compassion",
    title: "Meditation for Self-Compassion and Healing",
    instructor: "Ava Turner",
    category: "Anxiety",
    difficulty: "Beginner",
    durationMins: 18,
    rating: 4.8,
    imageUrl: "/images/d5441645-94f2-4ff0-9528-27e750848ecc.png",
    videoUrl: "https://www.youtube.com/embed/EwQkfoKxRvo?autoplay=1",
  },
  {
    id: "focus-clarity",
    title: "Enhance Focus and Mental Clarity",
    instructor: "Michael Reed",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 11,
    rating: 4.9,
    imageUrl: "/images/2b5d338b-9c71-4729-a9b2-ea691eab7fbc.png",
    videoUrl: "https://www.youtube.com/embed/s1oQNdWSlRo?autoplay=1",
  },
  {
    id: "gratitude",
    title: "Meditation on Gratitude",
    instructor: "Dr. Emma Rosa",
    category: "Focus",
    difficulty: "Beginner",
    durationMins: 10,
    rating: 4.7,
    imageUrl: "/images/36ed9fff-9337-4c15-b3ae-66888a11f06a.png",
    videoUrl: "https://www.youtube.com/embed/6p_yaNFSYao?autoplay=1",
  },
  {
    id: "stress-release",
    title: "Stress Release Guided Meditation",
    instructor: "Sophia Allen",
    category: "Stress Relief",
    difficulty: "Beginner",
    durationMins: 15,
    rating: 4.9,
    imageUrl: "/images/15d58c07-0b43-418f-a431-e6760cc98b25.png",
    videoUrl: "https://www.youtube.com/embed/syx3a1_LeFo?autoplay=1",
  },
  {
    id: "morning-clarity",
    title: "Morning Mindfulness Clarity Practice",
    instructor: "David Lin",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 12,
    rating: 4.8,
    imageUrl: "/images/10bd95e0-78a7-45e7-af92-5fe915dd0ed5.png",
    videoUrl: "https://www.youtube.com/embed/8Tb2bqt398k?autoplay=1",
  },
  {
    id: "sleep-harmony",
    title: "Deep Sleep Meditation – Drift into Rest",
    instructor: "Emma Williams",
    category: "Sleep",
    difficulty: "Beginner",
    durationMins: 20,
    rating: 4.7,
    imageUrl: "/images/75bdc2a3-e950-4399-a879-3d9e02c0bf33.png",
    videoUrl: "https://www.youtube.com/embed/sfSDQRdIvTc?autoplay=1",
  },
  {
    id: "mindfulness-beginners",
    title: "Mindfulness for Beginners",
    instructor: "Dr. Ava Patel",
    category: "Anxiety",
    difficulty: "Beginner",
    durationMins: 9,
    rating: 4.6,
    imageUrl: "/images/ad8faf2c-4502-46b9-a733-4765370ef501.png",
    videoUrl: "https://www.youtube.com/embed/fgChzlOt3XI?autoplay=1",
  },
  {
    id: "inner-calm",
    title: "Inner Calm and Serenity Meditation",
    instructor: "Daniel Park",
    category: "Stress Relief",
    difficulty: "Intermediate",
    durationMins: 14,
    rating: 4.9,
    imageUrl: "/images/2017bc07-60d8-4448-a418-342a24958cfd.png",
    videoUrl: "https://www.youtube.com/embed/I77hh5I69gA?autoplay=1",
  },
  {
    id: "present-moment",
    title: "Being Present – Awareness Meditation",
    instructor: "Liam Cooper",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 12,
    rating: 4.8,
    imageUrl: "/images/47b4f4c1-1ad7-4a4d-92a7-ab4ece550a99.png",
    videoUrl: "https://www.youtube.com/embed/8TTABLdGCKI?autoplay=1",
  },
  {
    id: "emotional-healing",
    title: "Emotional Healing and Balance",
    instructor: "Sarah Green",
    category: "Anxiety",
    difficulty: "Advanced",
    durationMins: 16,
    rating: 4.9,
    imageUrl: "/images/ada22a32-5d88-4d03-a783-f6e797e41e6f.png",
    videoUrl: "https://www.youtube.com/embed/1Dv-ldGLnIY?autoplay=1",
  },
  {
    id: "self-awareness",
    title: "Self-Awareness and Insight Meditation",
    instructor: "Dr. Noah Blake",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 13,
    rating: 4.7,
    imageUrl: "/images/d27d6c9f-134e-4cd3-b78e-8c7e45dad29c.png",
    videoUrl: "https://www.youtube.com/embed/JoDKbXEUrvQ?autoplay=1",
  },
];

export default function GuidedMeditationPage() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedVideo ? "hidden" : "auto";
  }, [selectedVideo]);

  const filtered = useMemo(() => {
    if (!query.trim()) return meditations;
    return meditations.filter(
      (m) =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.instructor.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const toggleFav = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="mb-10 text-4xl font-bold text-center text-white">
          🧘 Guided Meditation Dashboard
        </h1>

        {/* 🔍 Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-14">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search meditation by name, instructor, or focus..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 rounded-xl bg-[#161b22] border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none text-white"
          />
        </div>

        {/* 🎥 One Video per Row */}
        <div className="space-y-12">
          {filtered.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Card className="flex flex-col md:flex-row overflow-hidden bg-[#161b22] border border-gray-800 rounded-2xl shadow-lg">
                {/* Left Thumbnail */}
                <div
                  className="relative w-full md:w-3/5 h-80 cursor-pointer"
                  onClick={() => setSelectedVideo(m.videoUrl)}
                >
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Youtube className="w-14 h-14 p-2 text-red-500 rounded-full bg-white/90 shadow-lg" />
                  </div>
                </div>

                {/* Right Details */}
                <div className="flex flex-col justify-between w-full md:w-2/5 p-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">{m.title}</h2>
                    <p className="text-sm text-gray-400 mb-1">
                      by {m.instructor} • {m.category}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      {m.durationMins} min • {m.difficulty}
                    </p>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {m.durationMins} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" /> {m.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <Button
                      onClick={() => setSelectedVideo(m.videoUrl)}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg"
                      title="Watch this meditation video"
                      aria-label={`Watch ${m.title}`}
                    >
                      Watch Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleFav(m.id)}
                      className="rounded-lg"
                      title={favorites.includes(m.id) ? "Remove from favorites" : "Add to favorites"}
                      aria-label={favorites.includes(m.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(m.id) ? (
                        <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                      ) : (
                        <HeartOff className="w-5 h-5 text-gray-300" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-10">
          Showing {filtered.length} guided meditations
        </p>
      </motion.div>

      {/* 🎬 Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white z-10"
                title="Close video player"
                aria-label="Close video player"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={selectedVideo}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full aspect-video"
                title="Meditation video player"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
