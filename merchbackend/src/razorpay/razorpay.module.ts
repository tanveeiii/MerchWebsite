import { Module } from "@nestjs/common";
import { RazorpayController } from "./razorpay.controller";
import { RazorpayService } from "./razorpay.service";
import { PrismaService } from "src/prisma.service";

@Module({
    controllers: [RazorpayController],
    providers: [RazorpayService, PrismaService]
})
export class RazorpayModule {}
