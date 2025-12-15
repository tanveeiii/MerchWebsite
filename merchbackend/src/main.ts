import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import Razorpay from 'razorpay';
import * as dotenv from 'dotenv';

dotenv.config();

const Razorpay = require("razorpay")
export const secret = process.env.RAZORPAY_SECRET_KEY
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
})
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(5000);
  console.log("Server is running on: http://localhost:5000/api");
}
bootstrap();