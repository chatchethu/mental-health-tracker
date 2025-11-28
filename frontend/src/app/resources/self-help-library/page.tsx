"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Play, X, BookOpen } from "lucide-react";
import Image from "next/image";

export default function SelfHelpLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  const categories = [
    "All",
    "Anxiety",
    "Stress",
    "Sleep",
    "Mindfulness",
    "Self-Care",
    "Relationships",
    "Books",
  ];

  const resources = [
    {
      title: "5-Minute Breathing Exercise",
      description: "A short guided breathing session to reduce anxiety and restore calm.",
      content: `
This 5-minute guided breathing exercise helps regulate your body's stress response and restore clarity.  
Breathwork activates the parasympathetic nervous system, calming your heart rate and mind.  

🟢 **Technique:**  
1. Sit comfortably with your back straight.  
2. Inhale through your nose for 4 seconds.  
3. Hold your breath for 4 seconds.  
4. Exhale slowly through your mouth for 4 seconds.  
5. Pause for 2 seconds, then repeat.  

💡 *Tip:* Practice this twice daily — morning and night — for optimal results.
      `,
      category: "Anxiety",
      type: "Exercise",
      duration: "5 min",
      image: "/images/breathing.jpg",
      video: "https://www.youtube.com/embed/cUbwsB88xW0?si=nvU_SESd9JiEVbSq&autoplay=1",
    },
    {
      title: "Understanding Stress Triggers",
      description: "Learn to identify your stress patterns and manage them effectively.",
      content: `
Stress triggers are the roots of emotional exhaustion. By identifying and understanding them, you can transform how your body reacts.  

🧠 **What Causes Stress?**  
- Work overload or unclear expectations.  
- Negative self-talk or perfectionism.  
- Poor sleep, diet, or lifestyle imbalance.  

🌱 **Practical Steps to Manage:**  
1. Write down daily stressors in a journal.  
2. Recognize physical signs — rapid heartbeat, tension, irritability.  
3. Pause and take three deep breaths before reacting.  
4. Replace “I can’t handle this” with “I’ll take one step at a time.”  

The goal isn’t to eliminate stress — it’s to respond with awareness, not reactivity.
      `,
      category: "Stress",
      type: "Article",
      duration: "8 min read",
      image: "/images/stress.jpg",
    },
    {
      title: "Sleep Hygiene Basics",
      description: "Build healthy nighttime habits for restorative, high-quality sleep.",
      content: `
Sleep is the foundation of emotional balance and productivity.  
When you improve sleep hygiene, you heal both your body and your mind.  

🌙 **Sleep Tips:**  
1. Go to bed and wake up at consistent times.  
2. Avoid caffeine or screens an hour before bed.  
3. Keep your room cool and dark.  
4. Practice breathing or gratitude journaling before sleep.  
5. Replace doomscrolling with meditation or a calming podcast.  

💤 *Did You Know?*  
Your brain detoxifies while you sleep — making rest one of the most powerful self-care practices.
      `,
      category: "Sleep",
      type: "Video",
      duration: "12 min",
      image: "/images/sleep.jpg",
      video: "https://www.youtube.com/embed/q7amXedTasQ?si=Hh_-pXmHJpkuILF5&autoplay=1",
    },
    {
      title: "Mindful Walking Meditation",
      description: "Find stillness in motion — walking with awareness and intention.",
      content: `
Mindful walking combines physical movement with mental calmness.  
It transforms everyday walking into a grounding mindfulness experience.  

🚶 **How to Practice:**  
1. Walk slowly in a peaceful space — garden, park, or hallway.  
2. Feel each step touch the ground; notice your rhythm.  
3. Breathe naturally and match your steps with inhalation and exhalation.  
4. Observe surroundings — light, sound, air — without judgment.  

✨ Over time, walking meditation improves mood, focus, and body awareness.
      `,
      category: "Mindfulness",
      type: "Exercise",
      duration: "10 min",
      image: "/images/mindful.jpg",
      video: "https://www.youtube.com/embed/kapvpqwcNLQ?si=cZjXv4Yfb8jQ3MA3&autoplay=1",
    },
    {
      title: "Self-Compassion Guide",
      description: "Master the art of being kind to yourself during difficult times.",
      content: `
We often show more kindness to others than to ourselves. Self-compassion reverses that imbalance.  

💗 **Three Elements of Self-Compassion:**  
1. **Mindfulness** — Acknowledge pain without exaggeration or suppression.  
2. **Self-Kindness** — Speak to yourself like a friend, not a critic.  
3. **Common Humanity** — Remember that everyone makes mistakes.  

The practice of self-compassion nurtures emotional healing and strengthens resilience.
      `,
      category: "Self-Care",
      type: "Article",
      duration: "6 min read",
      image: "/images/selfcare.jpg",
    },
    {
      title: "Managing Social Anxiety",
      description: "Strategies to build confidence and calm in social settings.",
      content: `
Social anxiety is a fear of being judged or embarrassed — but it can be softened through gradual exposure and mindfulness.  

🗣️ **Steps to Manage:**  
- Rehearse small interactions and celebrate progress.  
- Focus attention outward — on conversation, not self-doubt.  
- Use grounding techniques (touch, breath, posture) before entering social spaces.  

With compassion and practice, every step becomes easier.
      `,
      category: "Anxiety",
      type: "Article",
      duration: "9 min read",
      image: "/images/social.jpg",
    },
    // 📚 Books
    {
      title: "The Power of Now",
      description: "Eckhart Tolle’s timeless guide to living in the present.",
      content: `
A profound book on spiritual awakening, The Power of Now teaches how to silence mental noise and experience life fully.  
It helps you detach from the constant chatter of your thoughts — bringing peace, awareness, and clarity.  
Perfect for readers seeking inner calm and mindfulness.
      `,
      category: "Books",
      type: "Book",
      duration: "250 pages",
      image: "/images/powerofnow.jpg",
      link: "https://www.goodreads.com/book/show/6708.The_Power_of_Now",
    },
    {
      title: "Atomic Habits",
      description: "Transform your habits, transform your life.",
      content: `
James Clear’s bestselling book simplifies how small, consistent improvements compound into remarkable transformations.  
It offers proven frameworks like the “Habit Loop” and “2-Minute Rule” — essential for long-term growth and mental discipline.
      `,
      category: "Books",
      type: "Book",
      duration: "280 pages",
      image: "/images/atomichabits.jpg",
      link: "https://www.goodreads.com/book/show/40121378-atomic-habits",
    },
    {
      title: "The Happiness Trap",
      description: "A practical guide to stop struggling and start living.",
      content: `
Based on Acceptance and Commitment Therapy (ACT), this book reveals how to manage emotions by accepting them — not fighting them.  
It’s ideal for those battling anxiety or negative thought cycles, teaching that acceptance leads to real freedom.
      `,
      category: "Books",
      type: "Book",
      duration: "240 pages",
      image: "/images/happinesstrap.jpg",
      link: "https://www.goodreads.com/book/show/56194.The_Happiness_Trap",
    },
  ];

  const filtered = resources.filter(
    (r) =>
      (category === "All" || r.category === category) &&
      (r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-yellow-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-amber-500" />
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Self-Help Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Curated articles, exercises, and books for mindfulness and wellness.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-3xl mx-auto mb-8">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm text-gray-900 bg-white border border-gray-300 outline-none rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm rounded-full border transition ${
                category === cat
                  ? "bg-amber-500 text-white border-amber-500"
                  : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-amber-100 dark:hover:bg-amber-800/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {filtered.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(r)}
              className="overflow-hidden border border-gray-200 shadow-lg cursor-pointer bg-white/80 dark:bg-gray-800/80 dark:border-gray-700 rounded-2xl hover:shadow-xl"
            >
              <div className="relative h-52">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {r.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  {r.description}
                </p>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{r.type} • {r.duration}</span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {r.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-sm text-center text-gray-500 dark:text-gray-400">
          Showing {filtered.length} resources
        </p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)} // 🔹 Click outside to close
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden bg-white shadow-xl dark:bg-gray-900 rounded-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} // prevent overlay click
            >
              <button
                className="absolute z-50 text-gray-500 top-3 right-3 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full h-56">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="p-6 text-gray-700 dark:text-gray-200 max-h-[70vh] overflow-y-auto">
                <h2 className="mb-2 text-2xl font-semibold">
                  {selected.title}
                </h2>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {selected.category} • {selected.duration}
                </p>

                {selected.video ? (
                  <div className="mb-5 overflow-hidden rounded-lg aspect-video">
                    <iframe
                      src={selected.video}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                      title={selected.title}
                    ></iframe>
                  </div>
                ) : (
                  <p className="leading-relaxed whitespace-pre-line">
                    {selected.content}
                  </p>
                )}

                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 mt-6 text-sm font-medium text-white rounded-lg bg-amber-500 hover:bg-amber-600"
                  >
                    <BookOpen className="w-4 h-4" /> Read Book
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
