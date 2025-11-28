import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /** 🎙 Voice Emotion + Tone Analysis (AssemblyAI + Groq) */
  async analyzeVoice(audioBuffer: Buffer): Promise<any> {
    const assemblyApiKey = this.configService.get<string>('ASSEMBLYAI_API_KEY');
    const groqApiKey = this.configService.get<string>('GROQ_API_KEY');

    if (!assemblyApiKey) {
      throw new BadRequestException('AssemblyAI API key not configured');
    }

    try {
      /* 1) Upload audio */
      this.logger.log('📤 Uploading audio to AssemblyAI...');
      const uploadResp = await firstValueFrom(
        this.httpService.post('https://api.assemblyai.com/v2/upload', audioBuffer, {
          headers: {
            Authorization: assemblyApiKey, // <-- AssemblyAI expects just the key (no "Bearer")
            'Content-Type': 'application/octet-stream',
            'Transfer-Encoding': 'chunked',
          },
        }),
      );

      const audioUrl = uploadResp.data?.upload_url;
      if (!audioUrl) throw new BadRequestException('Upload failed.');
      this.logger.log(`✅ Uploaded: ${audioUrl}`);

      /* 2) Create transcript with a VALID schema */
      // Keep to commonly-documented flags; remove unsupported fields like `features`, `emotion_detection`, `acoustic_analysis`
      const transcriptBody = {
        audio_url: audioUrl,
        language_detection: true,
        auto_highlights: true,
        entity_detection: true,
        iab_categories: false,
        speaker_labels: false,
        sentiment_analysis: true,
        // (optional) speech_model: 'best', // Works but not required
      };

      this.logger.log('🧠 Creating transcript request...');
      const createResp = await firstValueFrom(
        this.httpService.post('https://api.assemblyai.com/v2/transcript', transcriptBody, {
          headers: {
            Authorization: assemblyApiKey,
            'Content-Type': 'application/json',
          },
        }),
      );

      const transcriptId = createResp.data?.id;
      if (!transcriptId) throw new BadRequestException('Transcript creation failed.');
      this.logger.log(`🆔 Transcript ID: ${transcriptId}`);

      /* 3) Poll until done */
      let transcript: any;
      let tries = 0;
      do {
        if (tries++ > 40) throw new BadRequestException('Transcription timeout.');
        await new Promise((r) => setTimeout(r, 3000));
        const poll = await firstValueFrom(
          this.httpService.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
            headers: { Authorization: assemblyApiKey },
          }),
        );
        transcript = poll.data;
        this.logger.log(`⏳ Status: ${transcript.status}`);
      } while (transcript.status === 'queued' || transcript.status === 'processing');

      if (transcript.status === 'error') {
        const apiMsg = transcript?.error || 'Transcription failed at AssemblyAI.';
        this.logger.error(`❌ AAI error: ${apiMsg}`);
        throw new BadRequestException(apiMsg);
      }

      /* 4) Local emotion mapping from AAI sentiment */
      const analysis = this.analyzeFromTranscript(transcript);

      /* 5) Groq tone summary (optional) */
      const toneSummary = await this.getGroqToneSummary(groqApiKey, transcript.text, analysis);

      return {
        success: true,
        message: 'Voice analyzed successfully',
        data: {
          transcription: transcript.text,
          sentiment: analysis.sentiment,
          emotion: analysis.emotion,
          confidence: analysis.confidence,
          toneSummary,
          // We removed acoustic analysis since the endpoint doesn’t support it
          acoustic: { avgPitch: '—', avgEnergy: '—' },
          keywords: analysis.keywords,
          suggestions: analysis.suggestions,
          riskLevel: analysis.riskLevel,
        },
      };
    } catch (err: unknown) {
      // robust, type-safe error extraction
      const message =
        (typeof err === 'object' &&
          err !== null &&
          'message' in err &&
          (err as any).message) ||
        (typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          (err as any).response?.data?.error) ||
        'Voice analysis failed.';
      this.logger.error(`❌ Voice Analysis Error: ${message}`);
      throw new BadRequestException(message);
    }
  }

  /** Extract emotion & sentiment from the AAI transcript */
  private analyzeFromTranscript(transcript: any) {
    // AAI returns sentiment per sentence; pick the first/highest-confidence item
    const first = transcript?.sentiment_analysis_results?.[0];
    const sentiment =
      (first?.sentiment?.toString()?.toLowerCase() as 'positive' | 'negative' | 'neutral') ||
      'neutral';

    // Map sentiment → emotion for your UI
    const emotionMap: Record<'positive' | 'negative' | 'neutral', string> = {
      positive: 'happy',
      negative: 'sad',
      neutral: 'calm',
    };
    const emotion = emotionMap[sentiment];

    const confidence = typeof first?.confidence === 'number' ? first.confidence : 0.7;

    const keywords =
      transcript?.auto_highlights?.results?.map((r: any) => r.text).slice(0, 5) || [];

    const suggestions = this.suggestions(emotion);
    const riskLevel = this.risk(sentiment, confidence, keywords);

    return { sentiment, emotion, confidence, keywords, suggestions, riskLevel };
  }

  /** Groq tone summary (optional) */
  private async getGroqToneSummary(key: string | undefined, text: string, a: any) {
    if (!key) return 'Tone summary unavailable.';
    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: 'You are a kind mental-health coach. Be concise.' },
              {
                role: 'user',
                content: `Emotion=${a.emotion}, Sentiment=${a.sentiment}, Confidence=${a.confidence}. Text: """${text}"""`,
              },
            ],
            temperature: 0.7,
            max_tokens: 200,
          },
          { headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } },
        ),
      );
      return resp.data?.choices?.[0]?.message?.content ?? 'Tone summary unavailable.';
    } catch {
      return 'Unable to analyze tone right now.';
    }
  }

  /** Small helpers */
  private suggestions(emotion: string): string[] {
    const map: Record<string, string[]> = {
      happy: ['Keep spreading positivity!', 'Write 3 things you are grateful for.'],
      sad: ['Talk to someone you trust.', 'A short walk or music can help.'],
      calm: ['Enjoy this peaceful moment.', 'A short mindfulness session keeps it going.'],
    };
    return map[emotion] || ['Be kind to yourself today.'];
  }

  private risk(
    sentiment: 'positive' | 'negative' | 'neutral',
    confidence: number,
    keywords: string[],
  ): 'low' | 'medium' | 'high' {
    const high = ['suicide', 'hurt', 'kill', 'die', 'harm'];
    const med = ['depressed', 'anxious', 'stress', 'worried', 'alone'];
    const hasHigh = keywords.some((k) => high.some((w) => k.toLowerCase().includes(w)));
    const hasMed = keywords.some((k) => med.some((w) => k.toLowerCase().includes(w)));
    if (hasHigh) return 'high';
    if (hasMed || (sentiment === 'negative' && confidence > 0.8)) return 'medium';
    return 'low';
  }

  /** Simple text analysis fallback (used by /ai/text/analyze) */
  async analyzeText(text: string): Promise<any> {
    const lower = text.toLowerCase();
    const pos = ['good', 'great', 'love', 'happy', 'wonderful'].filter((w) =>
      lower.includes(w),
    ).length;
    const neg = ['sad', 'angry', 'tired', 'bad', 'hate'].filter((w) =>
      lower.includes(w),
    ).length;

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (pos > neg) sentiment = 'positive';
    if (neg > pos) sentiment = 'negative';

    const emotion = sentiment === 'positive' ? 'happy' : sentiment === 'negative' ? 'sad' : 'calm';

    return {
      sentiment,
      emotion,
      confidence: 0.8,
      suggestions: this.suggestions(emotion),
      riskLevel: 'low',
    };
  }
}
