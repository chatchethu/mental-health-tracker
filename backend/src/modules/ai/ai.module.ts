import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    HttpModule,   // Required for API calls (AssemblyAI + Groq)
    ConfigModule, // To read environment variables from .env
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService], // Export if used in other modules
})
export class AiModule {}
