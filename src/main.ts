import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';
import {useContainer} from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(compression());
  app.use(helmet());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
