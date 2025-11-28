import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MoodDocument = Mood & Document;

@Schema({ timestamps: true })
export class Mood {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['happy', 'sad', 'angry', 'calm', 'anxious', 'excited', 'neutral', 'frustrated', 'confident', 'lonely'] })
  emotion: string;

  @Prop({ required: true, min: 1, max: 10 })
  intensity: number;

  @Prop()
  notes?: string;

  @Prop()
  audioUrl?: string;

  @Prop()
  transcription?: string;

  @Prop({ type: Object })
  aiAnalysis?: {
    detectedEmotion: string;
    confidence: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    suggestions: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: Object })
  metadata?: {
    weather?: string;
    location?: string;
    activities?: string[];
    triggers?: string[];
  };
}

export const MoodSchema = SchemaFactory.createForClass(Mood);

// Create indexes for better performance
MoodSchema.index({ userId: 1, timestamp: -1 });
MoodSchema.index({ emotion: 1 });
MoodSchema.index({ timestamp: -1 });