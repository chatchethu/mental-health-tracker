import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  private readonly GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey = process.env.GROQ_API_KEY;

  @Post()
  @ApiOperation({ summary: 'Chat with Diya (Groq-powered LLaMA 3.3 assistant)' })
  @ApiResponse({ status: 200, description: 'AI-generated empathetic response' })
  async chat(@Body() body: { message: string; mood?: string }) {
    const { message, mood = 'neutral' } = body;

    if (!message || message.trim() === '') {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }

    if (!this.apiKey) {
      throw new HttpException('Missing GROQ_API_KEY in .env', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const response = await axios.post(
        this.GROQ_API_URL,
        {
          // ✅ Updated model (previous llama3-70b-8192 is deprecated)
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are Diya — a kind, emotionally intelligent mental wellness companion. ' +
                'Respond naturally and empathetically. Keep messages short, calm, and comforting.',
            },
            {
              role: 'user',
              content: `User mood: ${mood}. Message: ${message}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.8,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const reply = response.data?.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        throw new Error('Empty response from Groq');
      }

      return { reply };
    } catch (error: any) {
      console.error('🔥 Groq API Error:', error.response?.data || error.message);

      const status = error.response?.status || 500;
      const msg =
        error.response?.data?.error?.message ||
        error.message ||
        'Unexpected AI service issue';

      // Graceful fallbacks
      if (msg.includes('model_decommissioned')) {
        return {
          reply:
            "Oops 💭 — I just learned my old brain model was retired! Please try again — I'm now using a newer version.",
        };
      }

      if (status === 400) {
        return { reply: "Hmm 🤔, I had trouble processing that. Could you rephrase?" };
      }

      if (status === 401) {
        return { reply: "My Groq key isn't authorized 🔐. Please check your API key." };
      }

      if (status === 429) {
        return { reply: "I'm thinking a bit too hard 🧠💨. Let's try again soon." };
      }

      throw new HttpException(`AI service error: ${msg}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
