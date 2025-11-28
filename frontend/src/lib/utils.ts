import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------------------------------------------------------------- */
/* 🧩 Tailwind + Class Utilities                                               */
/* -------------------------------------------------------------------------- */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------------------------- */
/* 🕓 Date & Time Formatting Utilities                                        */
/* -------------------------------------------------------------------------- */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Time";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();

  if (isNaN(diffMs)) return "Unknown time";

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return formatDate(date);
}

/* -------------------------------------------------------------------------- */
/* ⏳ Performance Helpers                                                     */
/* -------------------------------------------------------------------------- */
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/* -------------------------------------------------------------------------- */
/* 🆔 Misc Helpers                                                            */
/* -------------------------------------------------------------------------- */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : text.slice(0, maxLength).trim() + "...";
}

/* -------------------------------------------------------------------------- */
/* 🎨 Visualization Helpers                                                   */
/* -------------------------------------------------------------------------- */
export function calculateColorFromIntensity(intensity: number): string {
  // Cap intensity between 0–10 and map to hue 0–120 (red → green)
  const clamped = Math.min(Math.max(intensity, 0), 10);
  const hue = 120 - clamped * 12;
  return `hsl(${hue}, 70%, 50%)`;
}

/* -------------------------------------------------------------------------- */
/* 💾 File Utilities                                                          */
/* -------------------------------------------------------------------------- */
export function downloadData(data: any, filename: string, type: "json" | "csv" = "json") {
  let content = "";
  let mimeType = "";

  if (type === "json") {
    content = JSON.stringify(data, null, 2);
    mimeType = "application/json";
  } else {
    if (Array.isArray(data)) {
      const headers = Object.keys(data[0] || {});
      const rows = data.map((item) => headers.map((header) => JSON.stringify(item[header] ?? "")).join(","));
      content = [headers.join(","), ...rows].join("\n");
    } else {
      content = JSON.stringify(data, null, 2);
    }
    mimeType = "text/csv";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.${type}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------- */
/* 📋 Clipboard Utility                                                       */
/* -------------------------------------------------------------------------- */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
}

/* -------------------------------------------------------------------------- */
/* 😄 Emotion Helpers                                                         */
/* -------------------------------------------------------------------------- */
export function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    calm: "😌",
    anxious: "😰",
    excited: "🎉",
    neutral: "😐",
    frustrated: "😤",
    confident: "💪",
    lonely: "🌙",
  };
  return emojiMap[emotion.toLowerCase()] || "😐";
}

export function getEmotionGradient(emotion: string): string {
  const gradientMap: Record<string, string> = {
    happy: "from-yellow-400 to-orange-400",
    sad: "from-blue-400 to-indigo-400",
    angry: "from-red-400 to-red-600",
    calm: "from-green-400 to-teal-400",
    anxious: "from-purple-400 to-pink-400",
    excited: "from-pink-400 to-purple-400",
    neutral: "from-gray-400 to-gray-500",
    frustrated: "from-orange-400 to-red-500",
    confident: "from-blue-500 to-purple-500",
    lonely: "from-indigo-400 to-blue-600",
  };
  return gradientMap[emotion.toLowerCase()] || "from-gray-400 to-gray-500";
}
