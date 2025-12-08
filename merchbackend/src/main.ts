import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS so frontend (port 3000) can talk to backend (port 5000)
  app.enableCors({
    origin: 'http://localhost:3000', // Specific security for your frontend
    credentials: true,
  });

  // 2. Add 'api' prefix so your routes become http://localhost:5000/api/auth/signup
  // Without this, it would just be http://localhost:5000/auth/signup
  app.setGlobalPrefix('api');

  // 3. Change port to 5000 (standard for backends)
  await app.listen(5000);
  console.log("Server is running on: http://localhost:5000/api");
}
bootstrap();