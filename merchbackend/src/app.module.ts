// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; 
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    PrismaModule, 
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule
  ],
})
export class AppModule {}
