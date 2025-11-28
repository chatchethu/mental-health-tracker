import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsObject, Min, Max, IsDateString } from 'class-validator';

export class CreateMoodDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Emotion type',
    enum: ['happy', 'sad', 'angry', 'calm', 'anxious', 'excited', 'neutral', 'frustrated', 'confident', 'lonely'],
    example: 'happy',
  })
  @IsEnum(['happy', 'sad', 'angry', 'calm', 'anxious', 'excited', 'neutral', 'frustrated', 'confident', 'lonely'])
  emotion: string;

  @ApiProperty({
    description: 'Emotion intensity (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  intensity: number;

  @ApiProperty({
    description: 'User notes about the mood',
    example: 'Feeling great after completing my project',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Audio recording URL',
    example: 'https://example.com/audio.webm',
    required: false,
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiProperty({
    description: 'Audio transcription',
    example: 'I am feeling really happy today because...',
    required: false,
  })
  @IsOptional()
  @IsString()
  transcription?: string;

  @ApiProperty({
    description: 'AI analysis results',
    example: {
      detectedEmotion: 'happy',
      confidence: 0.85,
      sentiment: 'positive',
      keywords: ['happy', 'excited', 'project'],
      suggestions: ['Continue expressing positive emotions', 'Share your joy with others'],
      riskLevel: 'low',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  aiAnalysis?: {
    detectedEmotion: string;
    confidence: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    suggestions: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };

  @ApiProperty({
    description: 'Mood timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  timestamp: Date;

  @ApiProperty({
    description: 'Additional metadata',
    example: {
      weather: 'sunny',
      location: 'home',
      activities: ['work', 'exercise'],
      triggers: ['achievement', 'social interaction'],
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    weather?: string;
    location?: string;
    activities?: string[];
    triggers?: string[];
  };
}