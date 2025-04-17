import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middlewares
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.ENABLE_CORS_DOMAIN?.split(','),
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Accept-Language',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // เปิดใช้การ transform
      whitelist: true, // ลบ property ที่ไม่ได้อยู่ใน DTO
      forbidNonWhitelisted: true, // ถ้าส่ง property ที่ไม่อยู่ใน DTO จะ throw error
    }),
  );

  // app.setGlobalPrefix('/api');

  const portRunning = process?.env?.PORT ?? 3000;
  await app.listen(portRunning, () => console.log(`server running port: ${portRunning}`));
}
bootstrap();
