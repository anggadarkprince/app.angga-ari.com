import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import {TerminusModule} from "@nestjs/terminus";
import {HttpModule} from "@nestjs/axios";
import {ThrottlerModule} from "@nestjs/throttler";

@Module({
  imports: [
      HttpModule,
      TerminusModule,
      ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
      }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
