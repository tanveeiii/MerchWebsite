// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; 
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ProductDiscountModule } from './product_discount/product_discount.module';

@Module({
  imports: [
    PrismaModule, 
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    ProductDiscountModule
  ],
})
export class AppModule {}
