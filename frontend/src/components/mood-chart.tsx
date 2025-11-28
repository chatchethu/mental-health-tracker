"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mood } from "@/types";
import { getEmotionEmoji } from "@/lib/utils";

interface MoodChartProps {
  data: Mood[];
  type?: "line" | "bar" | "pie";
  days?: number;
}

const EMOTION_COLORS = {
  happy: "#fbbf24",
  sad: "#60a5fa",
  angry: "#f87171",
  calm: "#34d399",
  anxious: "#a78bfa",
  excited: "#f472b6",
  neutral: "#9ca3af",
  frustrated: "#fb923c",
  confident: "#818cf8",
  lonely: "#6366f1",
};

type PieChartData = {
  name: string;
  value: number;
  emoji: string;
  color: string;
};

type LineBarChartData = {
  date: string;
  intensity: number;
  sentiment: number;
  emotion: string;
  emoji: string;
};

export function MoodChart({ data, type = "line", days = 7 }: MoodChartProps) {
  const chartData = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredData = data
      .filter((mood) => new Date(mood.timestamp) >= cutoffDate)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    if (type === "pie") {
      const emotionFrequency: Record<string, number> = {};
      filteredData.forEach((mood) => {
        emotionFrequency[mood.emotion] =
          (emotionFrequency[mood.emotion] || 0) + 1;
      });

      const pieData: PieChartData[] = Object.entries(emotionFrequency).map(
        ([emotion, count]) => ({
          name: emotion,
          value: count,
          emoji: getEmotionEmoji(emotion),
          color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS],
        })
      );

      return pieData;
    }

    // Group by date for line/bar charts
    const groupedData: Record<string, Mood[]> = {};
    filteredData.forEach((mood) => {
      const date = new Date(mood.timestamp).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(mood);
    });

    const lineBarData: LineBarChartData[] = Object.entries(groupedData).map(
      ([date, moods]) => {
        const avgIntensity =
          moods.reduce((sum, mood) => sum + mood.intensity, 0) / moods.length;
        const avgSentiment = getAverageSentiment(moods);
        const dominantEmotion = getMostFrequentEmotion(moods);

        return {
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          intensity: Math.round(avgIntensity),
          sentiment: Math.round(avgSentiment * 10) / 10,
          emotion: dominantEmotion,
          emoji: getEmotionEmoji(dominantEmotion),
        };
      }
    );

    return lineBarData;
  }, [data, days, type]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No mood data available for the selected period</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium flex items-center space-x-2">
            <span>{payload[0].payload.emoji}</span>
            <span>{payload[0].name}</span>
          </p>
          <p className="text-sm text-gray-600">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData as PieChartData[]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ emoji, percent }: any) => (
              <span>
                {emoji} {(percent * 100).toFixed(0)}%
              </span>
            )}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {(chartData as PieChartData[]).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={"color" in entry ? entry.color : "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip content={<PieCustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData as LineBarChartData[]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="intensity" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData as LineBarChartData[]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="intensity"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function getAverageSentiment(moods: Mood[]): number {
  const sentimentMap: Record<string, number> = {
    happy: 1,
    excited: 0.9,
    confident: 0.8,
    calm: 0.6,
    neutral: 0,
    anxious: -0.4,
    sad: -0.6,
    frustrated: -0.7,
    angry: -0.9,
    lonely: -0.8,
  };

  const totalSentiment = moods.reduce(
    (sum, mood) => sum + (sentimentMap[mood.emotion] || 0),
    0
  );
  return totalSentiment / moods.length;
}

function getMostFrequentEmotion(moods: Mood[]): string {
  const frequency: Record<string, number> = {};
  moods.forEach((mood) => {
    frequency[mood.emotion] = (frequency[mood.emotion] || 0) + 1;
  });

  return (
    Object.entries(frequency).sort(([, a], [, b]) => b - a)[0]?.[0] || "neutral"
  );
}

// Chart type selector component
export function MoodChartContainer({ data }: { data: Mood[] }) {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mood Analysis</h3>
        <div className="flex space-x-2">
          {(["line", "bar", "pie"] as const).map((type) => (
            <Button
              key={type}
              variant={chartType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <MoodChart data={data} type={chartType} />
    </div>
  );
}
