"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMoodStore } from "@/store/mood-store";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export default function AIChatWidget() {
  const { currentMood } = useMoodStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hey there 👋 I’m Diya 💬 — your mindful buddy! How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🧠 Fetch AI Response from Groq-powered backend
  const getAIResponse = async (text: string): Promise<string> => {
    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mood: currentMood || "neutral",
        }),
      });

      // If backend returns any error
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend error: ${res.status} - ${res.statusText}`, errorText);

        // Handle common Groq errors gracefully
        if (res.status === 400)
          return "Hmm 🤔, that message was tricky for me. Can you rephrase it?";
        if (res.status === 401)
          return "My connection to Groq isn’t authorized 🔐. Please check my backend key.";
        if (res.status === 429)
          return "I’m a little overwhelmed 🌩️. Let’s pause for a moment and try again soon.";
        if (res.status === 500)
          return "Looks like my mind needs a quick reset 🤯. The server had trouble replying.";

        return "Hmm... my AI brain feels fuzzy 🤯. The server had trouble replying — please try again soon.";
      }

      const data = await res.json();
      if (!data.reply) {
        return "I’m listening 💜 but didn’t quite catch that. Could you say it another way?";
      }

      return data.reply;
    } catch (err: any) {
      console.error("❌ Network or fetch error:", err);
      return "Oops 😅 I can’t reach my Groq brain right now. Please make sure the backend is running on port 3001.";
    }
  };

  // ✉️ Handle user message send
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    const userText = input;
    setInput("");
    setIsTyping(true);

    const replyText = await getAIResponse(userText);

    setTimeout(() => {
      const aiMsg: ChatMessage = { sender: "ai", text: replyText };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* 🧘 Floating Chat Button */}
      <motion.div
        className="fixed z-50 cursor-pointer bottom-6 right-6"
        initial={{ scale: 0.95, opacity: 0.9 }}
        animate={{ scale: [1, 1.05, 1], y: [0, -6, 0], opacity: 1 }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        onClick={() => setOpen(true)}
      >
        <div className="relative flex items-center justify-center w-[68px] h-[68px] rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-500 shadow-lg hover:shadow-purple-400/50 transition duration-300">
          <span className="absolute inset-0 rounded-full bg-purple-400/40 blur-lg animate-ping-slow" />
          <span className="relative z-10 text-3xl select-none">🧑🏻‍⚕️</span>
        </div>
      </motion.div>

      {/* 💬 Chat Window */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background Blur */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Chat Box */}
            <motion.div
              className="fixed z-50 w-[480px] h-[550px] p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl bottom-10 right-[8rem] flex flex-col border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                  Diya 🧑🏻‍⚕️
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto rounded-lg bg-gray-50/80 dark:bg-gray-800/60">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[80%] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 text-gray-800 bg-white shadow dark:bg-gray-700 dark:text-gray-100 rounded-2xl">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                        <span
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Field */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type something to Diya..."
                  className="flex-grow px-4 py-3 text-sm border rounded-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                <Button
                  onClick={handleSend}
                  className="bg-purple-600 rounded-full hover:bg-purple-700"
                >
                  <Send className="w-5 h-5 text-white" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ping Animation */}
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}
