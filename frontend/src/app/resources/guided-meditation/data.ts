// src/app/resources/guided-meditation/data.ts

export type Meditation = {
  id: string;
  title: string;
  instructor: string;
  category: "Sleep" | "Anxiety" | "Focus" | "Stress Relief";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMins: number;
  popularity: number;
  rating: number;
  dateISO: string;
  imageUrl: string;
  audioUrl: string;
  videoUrl?: string;
};

export const meditations: Meditation[] = [
  {
    id: "self-compassion",
    title: "Meditation for Self-Compassion and Healing",
    instructor: "Ava Turner",
    category: "Anxiety",
    difficulty: "Beginner",
    durationMins: 18,
    popularity: 4281,
    rating: 4.8,
    dateISO: "2025-04-04",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop", // calm seated sunrise
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/EwQkfoKxRvo",
  },
  {
    id: "focus-clarity",
    title: "Enhance Focus and Mental Clarity",
    instructor: "Michael Reed",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 11,
    popularity: 2916,
    rating: 4.9,
    dateISO: "2025-05-10",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop", // forest meditation light
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/s1oQNdWSlRo",
  },
  {
    id: "gratitude",
    title: "Meditation on Gratitude",
    instructor: "Dr. Emma Rosa",
    category: "Focus",
    difficulty: "Beginner",
    durationMins: 10,
    popularity: 1876,
    rating: 4.7,
    dateISO: "2025-02-08",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop", // sunset nature gratitude
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/6p_yaNFSYao",
  },
  {
    id: "stress-release",
    title: "Stress Release Guided Meditation",
    instructor: "Sophia Allen",
    category: "Stress Relief",
    difficulty: "Beginner",
    durationMins: 15,
    popularity: 1578,
    rating: 4.9,
    dateISO: "2025-03-20",
    imageUrl:
      "https://images.unsplash.com/photo-1522202222206-b3d9b1e6a4a2?q=80&w=1200&auto=format&fit=crop", // peaceful forest reflection
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/syx3a1_LeFo",
  },
  {
    id: "morning-clarity",
    title: "Morning Mindfulness Clarity Practice",
    instructor: "David Lin",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 12,
    popularity: 2044,
    rating: 4.8,
    dateISO: "2025-03-12",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", // serene mountain morning
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/8Tb2bqt398k",
  },
  {
    id: "sleep-harmony",
    title: "Deep Sleep Meditation – Drift into Rest",
    instructor: "Emma Williams",
    category: "Sleep",
    difficulty: "Beginner",
    durationMins: 20,
    popularity: 2381,
    rating: 4.7,
    dateISO: "2025-01-25",
    imageUrl:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1200&auto=format&fit=crop", // night calm mountains
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/sfSDQRdIvTc",
  },
  {
    id: "mindfulness-beginners",
    title: "Mindfulness for Beginners",
    instructor: "Dr. Ava Patel",
    category: "Anxiety",
    difficulty: "Beginner",
    durationMins: 9,
    popularity: 1765,
    rating: 4.6,
    dateISO: "2025-01-10",
    imageUrl:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop", // simple yoga pose
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/fgChzlOt3XI",
  },
  {
    id: "inner-calm",
    title: "Inner Calm and Serenity Meditation",
    instructor: "Daniel Park",
    category: "Stress Relief",
    difficulty: "Intermediate",
    durationMins: 14,
    popularity: 2010,
    rating: 4.9,
    dateISO: "2025-02-28",
    imageUrl:
      "https://images.unsplash.com/photo-1525097487452-6278ff080c31?q=80&w=1200&auto=format&fit=crop", // meditation on wood deck
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/I77hh5I69gA",
  },
  {
    id: "present-moment",
    title: "Being Present – Awareness Meditation",
    instructor: "Liam Cooper",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 12,
    popularity: 1560,
    rating: 4.8,
    dateISO: "2025-02-15",
    imageUrl:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop", // sitting sunset deck
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/8TTABLdGCKI",
  },
  {
    id: "emotional-healing",
    title: "Emotional Healing and Balance",
    instructor: "Sarah Green",
    category: "Anxiety",
    difficulty: "Advanced",
    durationMins: 16,
    popularity: 3100,
    rating: 4.9,
    dateISO: "2025-01-20",
    imageUrl:
      "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=1200&auto=format&fit=crop", // sunlit grass yoga
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/1Dv-ldGLnIY",
  },
  {
    id: "self-awareness",
    title: "Self-Awareness and Insight Meditation",
    instructor: "Dr. Noah Blake",
    category: "Focus",
    difficulty: "Intermediate",
    durationMins: 13,
    popularity: 2455,
    rating: 4.7,
    dateISO: "2025-02-02",
    imageUrl:
      "https://images.unsplash.com/photo-1522202222206-b3d9b1e6a4a2?q=80&w=1200&auto=format&fit=crop", // forest sitting peace
    audioUrl: "/sounds/meditation.mp3",
    videoUrl: "https://www.youtube.com/embed/JoDKbXEUrvQ",
  },
];
