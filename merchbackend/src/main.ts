import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express'; // <--- REQUIRED IMPORT

dotenv.config();

const Razorpay = require("razorpay");
export const secret = process.env.RAZORPAY_SECRET_KEY;
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

async function bootstrap() {
  // 1. Pass { bodyParser: false } to disable the default 100kb limit
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // 2. Manually apply the parser with a huge limit (50MB)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  await app.listen(5000);
  console.log("Server is running on: http://localhost:5000/api");
}
bootstrap();