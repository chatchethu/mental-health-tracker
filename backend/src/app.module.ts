import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MoodsModule } from './modules/moods/moods.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { ChatModule } from './chat/chat.module'; // 🧠 Groq-powered chat module

@Module({
  imports: [
    /* 🌍 Environment configuration */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    /* 🍃 MongoDB connection */
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/mental-health-tracker',
    ),

    /* 🔐 Feature modules */
    AuthModule,
    UsersModule,
    MoodsModule,
    AiModule,
    HealthModule,

    /* 💬 Groq LLaMA 3 Chat */
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
