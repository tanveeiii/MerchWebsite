import { Module } from "@nestjs/common";
import { ProductDiscountService } from "./product_discount.service";
import { PrismaService } from "src/prisma.service";
import { ProductController } from "src/product/product.controller";

@Module({
    controllers: [ProductController],
    providers: [ProductDiscountService, PrismaService]
})

export class ProductDiscountModule {};