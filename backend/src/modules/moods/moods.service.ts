import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mood, MoodDocument } from './schemas/mood.schema';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';

/* ------------------------------------------------------------------
   🧩 Interface Definitions (Exported for Controller)
------------------------------------------------------------------ */
export interface MoodStats {
  totalMoods: number;
  emotionFrequency: Record<string, number>;
  averageIntensity: number;
  sentimentDistribution: Record<string, number>;
  mostFrequentEmotion: string | null;
  moodStability: number;
}

export interface MoodTrend {
  date: string;
  avgIntensity: number;
  dominantEmotion: string;
  moodCount: number;
}

/* ------------------------------------------------------------------
   💫 Service Definition
------------------------------------------------------------------ */
@Injectable()
export class MoodsService {
  constructor(@InjectModel(Mood.name) private moodModel: Model<MoodDocument>) {}

  /* 🔹 Create a new mood entry */
  async create(createMoodDto: CreateMoodDto): Promise<Mood> {
    const mood = new this.moodModel(createMoodDto);
    return mood.save();
  }

  /* 🔹 Get all moods (optionally by user) */
  async findAll(userId?: string): Promise<Mood[]> {
    const filter = userId ? { userId } : {};
    return this.moodModel.find(filter).sort({ timestamp: -1 }).exec();
  }

  /* 🔹 Find mood by ID */
  async findById(id: string): Promise<Mood> {
    const mood = await this.moodModel.findById(id).exec();
    if (!mood) throw new NotFoundException(`Mood with ID ${id} not found`);
    return mood;
  }

  /* 🔹 Get recent moods for a specific user */
  async findByUserId(userId: string, limit = 50): Promise<Mood[]> {
    return this.moodModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  /* 🔹 Filter moods by date range */
  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Mood[]> {
    return this.moodModel
      .find({
        userId,
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .sort({ timestamp: -1 })
      .exec();
  }

  /* 🔹 Update a mood entry */
  async update(id: string, updateMoodDto: UpdateMoodDto): Promise<Mood> {
    const mood = await this.moodModel
      .findByIdAndUpdate(id, updateMoodDto, { new: true })
      .exec();
    if (!mood) throw new NotFoundException(`Mood with ID ${id} not found`);
    return mood;
  }

  /* 🔹 Delete a mood entry */
  async remove(id: string): Promise<void> {
    const result = await this.moodModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Mood with ID ${id} not found`);
  }

  /* 🔹 Generate mood statistics */
  async getMoodStats(userId: string, days = 30): Promise<MoodStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.moodModel
      .find({ userId, timestamp: { $gte: startDate } })
      .exec();

    const emotionFrequency = moods.reduce<Record<string, number>>((acc, mood) => {
      acc[mood.emotion] = (acc[mood.emotion] || 0) + 1;
      return acc;
    }, {});

    const avgIntensity =
      moods.length > 0
        ? moods.reduce((sum, mood) => sum + mood.intensity, 0) / moods.length
        : 0;

    const sentimentDistribution = moods.reduce<Record<string, number>>(
      (acc, mood) => {
        const sentiment = mood.aiAnalysis?.sentiment || 'neutral';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      totalMoods: moods.length,
      emotionFrequency,
      averageIntensity: Math.round(avgIntensity * 100) / 100,
      sentimentDistribution,
      mostFrequentEmotion:
        Object.entries(emotionFrequency).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        null,
      moodStability: this.calculateMoodStability(moods),
    };
  }

  /* 🔹 Generate mood trend data */
  async getMoodTrends(userId: string, days = 30): Promise<MoodTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.moodModel
      .find({ userId, timestamp: { $gte: startDate } })
      .sort({ timestamp: 1 })
      .exec();

    const dailyData = moods.reduce<Record<string, Mood[]>>((acc, mood) => {
      const date = mood.timestamp.toISOString().split('T')[0];
      acc[date] = acc[date] || [];
      acc[date].push(mood);
      return acc;
    }, {});

    return Object.entries(dailyData).map(([date, dayMoods]) => {
      const avgIntensity =
        dayMoods.reduce((sum, mood) => sum + mood.intensity, 0) /
        dayMoods.length;
      const dominantEmotion = this.getMostFrequentEmotion(dayMoods);

      return {
        date,
        avgIntensity: Math.round(avgIntensity * 100) / 100,
        dominantEmotion,
        moodCount: dayMoods.length,
      };
    });
  }

  /* ------------------------------------------------------------------
     ⚙️ Helper Methods
  ------------------------------------------------------------------ */

  private calculateMoodStability(moods: Mood[]): number {
    if (moods.length < 2) return 100;

    const intensities = moods.map((m) => m.intensity);
    const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    const variance =
      intensities.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
      intensities.length;
    const stdDev = Math.sqrt(variance);

    const maxStdDev = 3;
    const stability = Math.max(0, 100 - (stdDev / maxStdDev) * 100);
    return Math.round(stability);
  }

  private getMostFrequentEmotion(moods: Mood[]): string {
    const freq: Record<string, number> = {};
    moods.forEach((m) => {
      freq[m.emotion] = (freq[m.emotion] || 0) + 1;
    });
    return Object.entries(freq).sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';
  }
}
