import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Enable class-validator globally
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // cookie parser for accessing cookie with jwt
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000'], //Nuxt.js frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // allow cookies
  });

  await app.listen(8000);
}
bootstrap();
