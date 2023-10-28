import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(cookieParser(process.env.COOKIE_KEY));
  app.use(compression());
  app.use(helmet());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
