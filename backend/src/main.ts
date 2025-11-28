import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { json, urlencoded } from 'express';

async function bootstrap() {
  // ✅ Ensure logs directory exists
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // ✅ Logger setup
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(
            ({ timestamp, level, message }) =>
              `[${timestamp}] ${level}: ${message}`,
          ),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.json(),
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.json(),
      }),
    ],
  });

  // ✅ Create NestJS app
  const app = await NestFactory.create(AppModule, { logger });

  const configService = app.get(ConfigService);
  const globalLogger = new Logger('Bootstrap');

  // 🌍 Enable CORS for frontend (Next.js)
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
  app.enableCors({
    origin: [frontendUrl, 'http://127.0.0.1:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // 📦 JSON & URL encoded config
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // 🧩 Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 🛡️ API prefix
  app.setGlobalPrefix('api');

  // 📘 Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('🧠 Mental Health Tracker API')
    .setDescription(
      'API documentation for the Mental Health Tracker. Includes AI chat endpoint powered by GPT.',
    )
    .setVersion('3.0')
    .addBearerAuth()
    .addTag('chat')
    .addTag('users')
    .addTag('moods')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // 🚀 Start server
  const port = parseInt(configService.get('PORT') || '3001', 10);
  await app.listen(port);

  const url = await app.getUrl();
  globalLogger.log('--------------------------------------------------');
  globalLogger.log(`🚀 Server running at:      ${url}`);
  globalLogger.log(`📚 Swagger docs:           ${url}/api/docs`);
  globalLogger.log(`✅ CORS allowed from:      ${frontendUrl}`);
  globalLogger.log('--------------------------------------------------');
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap error:', err);
  process.exit(1);
});
