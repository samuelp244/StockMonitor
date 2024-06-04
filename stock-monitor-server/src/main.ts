import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // true for all origins
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(1337);
}
bootstrap();
