import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /* 🎙 Voice Emotion + Tone Analysis */
  @Post('voice/analyze')
  @UseInterceptors(FileInterceptor('audio'))
  async analyzeVoice(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file || !file.buffer) {
        return {
          success: false,
          message: 'No valid audio file uploaded.',
        };
      }

      const result = await this.aiService.analyzeVoice(file.buffer);

      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (err: any) {
      console.error('🎙 Voice Analysis Error:', err?.message || err);
      // ✅ Always return JSON, not HTML
      return {
        success: false,
        message:
          err?.message ||
          'Voice analysis failed. Please try again or check the backend logs.',
      };
    }
  }

  /* 💬 Text Sentiment / Emotion Analysis */
  @Post('text/analyze')
  async analyzeText(@Body() body: { text: string }) {
    try {
      if (!body?.text || typeof body.text !== 'string') {
        return {
          success: false,
          message: 'Invalid request: missing text',
        };
      }

      const analysis = await this.aiService.analyzeText(body.text);

      return {
        success: true,
        message: 'Text analyzed successfully.',
        data: analysis,
      };
    } catch (err: any) {
      console.error('💬 Text Analysis Error:', err?.message || err);
      // ✅ Same: always structured JSON
      return {
        success: false,
        message:
          err?.message ||
          'Text analysis failed. Please try again or check backend logs.',
      };
    }
  }
}
