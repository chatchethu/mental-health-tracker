"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mood, EmotionType } from "@/types";
import { getEmotionEmoji, getEmotionGradient, formatDateTime } from "@/lib/utils";
import { Heart, Brain, TrendingUp, AlertTriangle } from "lucide-react";

interface MoodCardProps {
  mood: Mood | null;
  showAnalysis?: boolean;
}

export function MoodCard({ mood, showAnalysis = true }: MoodCardProps) {
  if (!mood) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No mood data available</p>
            <p className="text-sm mt-2">Start by recording your voice or checking in your mood</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIntensityColor = (intensity: number): string => {
    if (intensity <= 3) return "bg-green-500";
    if (intensity <= 6) return "bg-yellow-500";
    if (intensity <= 8) return "bg-orange-500";
    return "bg-red-500";
  };

  const getIntensityLabel = (intensity: number): string => {
    if (intensity <= 2) return "Very Mild";
    if (intensity <= 4) return "Mild";
    if (intensity <= 6) return "Moderate";
    if (intensity <= 8) return "Strong";
    return "Very Strong";
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
    <motion.div variants={cardVariants}>
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${getEmotionGradient(mood.emotion)}`} />
        
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{getEmotionEmoji(mood.emotion)}</span>
              <div>
                <h3 className="text-xl font-bold capitalize">{mood.emotion}</h3>
                <p className="text-sm text-gray-500">
                  {formatDateTime(mood.timestamp)}
                </p>
              </div>
            </div>
            <Badge className={getIntensityColor(mood.intensity)}>
              {getIntensityLabel(mood.intensity)}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Intensity Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Intensity</span>
              <span className="text-gray-600">{mood.intensity}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getIntensityColor(mood.intensity)}`}
                initial={{ width: 0 }}
                animate={{ width: `${mood.intensity * 10}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Notes */}
          {mood.notes && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-medium text-sm">Personal Notes</span>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {mood.notes}
              </p>
            </div>
          )}

          {/* AI Analysis */}
          {showAnalysis && mood.aiAnalysis && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">AI Analysis</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRiskColor(mood.aiAnalysis.riskLevel)}`}
                >
                  {mood.aiAnalysis.riskLevel} risk
                </Badge>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Detected Emotion:</span>
                  <span className="font-medium capitalize">{mood.aiAnalysis.detectedEmotion}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">{Math.round(mood.aiAnalysis.confidence * 100)}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Sentiment:</span>
                  <span className="font-medium capitalize">{mood.aiAnalysis.sentiment}</span>
                </div>

                {mood.aiAnalysis.keywords.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-gray-600">Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {mood.aiAnalysis.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {mood.aiAnalysis.suggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Suggestions</span>
                  </div>
                  <ul className="space-y-1">
                    {mood.aiAnalysis.suggestions.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-sm text-gray-600 flex items-start space-x-2"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        <span>{suggestion}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {mood.aiAnalysis.riskLevel === "high" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800 dark:text-red-200">
                      High Risk Detected
                    </p>
                    <p className="text-red-600 dark:text-red-300">
                      Consider reaching out to a mental health professional or support system.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Audio Recording Indicator */}
          {mood.audioUrl && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Voice recording available</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}