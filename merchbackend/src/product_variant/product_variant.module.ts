import { Module } from "@nestjs/common";
import { ProductVariantController } from "./product_variant.controller";
import { ProductVariantService } from "./product_variant.service";
import { PrismaService } from "src/prisma.service";

@Module({
    controllers: [ProductVariantController],
    providers: [ProductVariantService, PrismaService],
})
export class ProductVariantModule {}