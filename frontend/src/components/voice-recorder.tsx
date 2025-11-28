"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, Play, Pause, Trash2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMoodStore } from "@/store/mood-store";
import toast from "react-hot-toast";

/** Backend AI analysis structure */
type AIResult = {
  emotion: string;
  confidence: number;
  sentiment?: string;
  transcription?: string;
  keywords?: string[];
  suggestions?: string[];
  riskLevel?: "low" | "medium" | "high";
  toneSummary?: string;
  acoustic?: {
    avgPitch?: string | number;
    avgEnergy?: string | number;
  };
};

/** Supported emotions for type safety (align to your store) */
type EmotionType =
  | "happy"
  | "sad"
  | "angry"
  | "calm"
  | "neutral"
  | "anxious"
  | "excited";

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { addMood, setLoading } = useMoodStore();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  /** Util: safe JSON parse, fallback to text */
  const safeParse = async (res: Response) => {
    try {
      const txt = await res.text();
      try {
        return { data: JSON.parse(txt), raw: txt };
      } catch {
        return { data: null, raw: txt };
      }
    } catch {
      return { data: null, raw: "" };
    }
  };

  /** Util: best error message to display */
  const getErrMsg = (status: number, parsed: any, raw: string) => {
    if (parsed?.message) return parsed.message as string;
    if (raw) return raw.slice(0, 140);
    if (status >= 500) return "Server error while analyzing voice.";
    if (status === 415) return "Unsupported audio format. Try again.";
    if (status === 400) return "Invalid audio uploaded. Please re-record.";
    return "Voice analysis failed on server.";
  };

  /** 🎙 Start recording */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
      toast.success("🎙️ Recording started — speak naturally!");
    } catch (err) {
      console.warn("Microphone error:", err);
      toast.error("Please allow microphone access.");
    }
  };

  /** 🛑 Stop recording */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast("Recording stopped. Ready to analyze 🎧");
    }
  };

  /** ✅ Normalize emotion string */
  const normalizeEmotion = (emotion: string | undefined): EmotionType => {
    const valid: EmotionType[] = [
      "happy",
      "sad",
      "angry",
      "calm",
      "neutral",
      "anxious",
      "excited",
    ];
    if (!emotion) return "neutral";
    const lower = emotion.toLowerCase() as EmotionType;
    return valid.includes(lower) ? lower : "neutral";
  };

  /** ✅ Normalize sentiment */
  const normalizeSentiment = (
    sentiment: string | undefined
  ): "neutral" | "positive" | "negative" => {
    if (!sentiment) return "neutral";
    const lower = sentiment.toLowerCase();
    return ["positive", "negative", "neutral"].includes(lower)
      ? (lower as "neutral" | "positive" | "negative")
      : "neutral";
  };

  /** 🧠 Send audio to backend */
  const analyzeVoice = async () => {
    if (!recordedBlob) {
      toast.error("No recording found. Please record your voice first.");
      return;
    }

    setIsAnalyzing(true);
    setLoading(true);
    setAiAnalysis(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

      const formData = new FormData();
      // IMPORTANT: the field name must be "audio" to match FileInterceptor('audio')
      formData.append("audio", recordedBlob, "voice.webm");

      const response = await fetch(`${API_URL}/ai/voice/analyze`, {
        method: "POST",
        body: formData,
      });

      const { data: parsed, raw } = await safeParse(response);

      // Handle non-2xx or backend-declared failure
      if (!response.ok || !parsed || parsed.success === false) {
        console.warn("Voice analysis failed payload:", parsed || raw || "(empty)");
        const msg = getErrMsg(response.status, parsed, raw);
        toast.error(msg);
        return;
      }

      const data = parsed.data as AIResult;
      setAiAnalysis(data);

      const emotion = normalizeEmotion(data.emotion);
      const sentiment = normalizeSentiment(data.sentiment);

      /** Add analyzed mood to store */
      addMood({
        userId: "user_1",
        emotion,
        intensity: Math.round((data.confidence ?? 0.7) * 10),
        audioUrl: audioURL,
        transcription: data.transcription || "Voice analyzed successfully.",
        aiAnalysis: {
          detectedEmotion: emotion,
          confidence: data.confidence,
          sentiment,
          keywords: data.keywords ?? [],
          suggestions: data.suggestions ?? [],
          riskLevel: data.riskLevel ?? "low",
        },
        timestamp: new Date(),
      });

      toast.success(
        `🧠 ${emotion.toUpperCase()} (${Math.round(
          (data.confidence ?? 0) * 100
        )}%) detected!`
      );

      window.dispatchEvent(new Event("mood-updated"));
    } catch (err: any) {
      console.warn("Voice analysis network/client error:", err);
      toast.error(err?.message || "Error analyzing your voice.");
    } finally {
      setIsAnalyzing(false);
      setLoading(false);
    }
  };

  /** ▶️ / ⏸ Playback */
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  /** ♻️ Reset recording */
  const clearRecording = () => {
    setRecordedBlob(null);
    setAudioURL("");
    setAiAnalysis(null);
    setRecordingTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
  };

  /** ⏱ Format */
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!recordedBlob ? (
          <motion.div
            key="record"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative h-20 w-20 rounded-full shadow-md ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 voice-wave"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
              disabled={isAnalyzing}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="controls"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            <Card className="shadow-md backdrop-blur-lg bg-white/20 dark:bg-gray-800/40">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">🎧 Recording Preview</span>
                  <Button variant="ghost" size="sm" onClick={clearRecording} disabled={isAnalyzing}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <audio
                  ref={audioRef}
                  src={audioURL}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={togglePlayback} disabled={isAnalyzing}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="w-1/3 h-full bg-purple-500 animate-pulse dark:bg-purple-400" />
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(recordingTime)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={analyzeVoice}
              disabled={isAnalyzing}
              className="w-full text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" /> Analyze Emotion
                </>
              )}
            </Button>

            {aiAnalysis && (
              <motion.div
                className="p-4 mt-4 shadow-inner rounded-xl bg-white/30 dark:bg-gray-800/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className="mb-2 font-semibold text-purple-600 dark:text-purple-300">
                  🧠 AI Emotional Insight
                </h4>

                <p className="mb-1 text-sm">
                  🎭 Detected Emotion: <b>{aiAnalysis.emotion}</b>{" "}
                  ({((aiAnalysis.confidence ?? 0) * 100).toFixed(1)}%)
                </p>

                {(aiAnalysis.acoustic?.avgPitch || aiAnalysis.acoustic?.avgEnergy) && (
                  <p className="mb-2 text-sm">
                    🎵 Tone — Pitch: <b>{aiAnalysis.acoustic?.avgPitch ?? "—"}</b>, Energy:{" "}
                    <b>{aiAnalysis.acoustic?.avgEnergy ?? "—"}</b>
                  </p>
                )}

                {aiAnalysis.toneSummary && (
                  <p className="mb-2 text-sm italic text-indigo-500">💬 {aiAnalysis.toneSummary}</p>
                )}

                {aiAnalysis.suggestions?.length ? (
                  <ul className="pl-5 space-y-1 text-sm list-disc">
                    {aiAnalysis.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                ) : null}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-2 text-center"
        >
          <div className="font-mono text-2xl text-red-500">{formatTime(recordingTime)}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Recording in progress...</p>
          <Button variant="outline" size="sm" onClick={stopRecording}>
            Stop Recording
          </Button>
        </motion.div>
      )}
    </div>
  );
}
