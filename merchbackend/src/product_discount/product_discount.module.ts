import { Module } from '@nestjs/common';
import { ProductDiscountService } from './product_discount.service';
import { PrismaService } from 'src/prisma.service';
import { ProductDiscountController } from './product_discount.controller';

@Module({
  controllers: [ProductDiscountController],
  providers: [ProductDiscountService, PrismaService],
})
export class ProductDiscountModule {}
