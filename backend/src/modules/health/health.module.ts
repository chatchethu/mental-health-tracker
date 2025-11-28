import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus'; // ✅ Provides HealthCheckService
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,     // ✅ Add this line
    MongooseModule,     // optional, if used in your health checks
  ],
  controllers: [HealthController],
})
export class HealthModule {}
