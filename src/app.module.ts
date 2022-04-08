import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import {TerminusModule} from "@nestjs/terminus";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
      HttpModule,
      TerminusModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
