import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { instance } from "src/main";
import { RazorpayService } from "./razorpay.service";
import type { Response } from "express";

@Controller('razorpay')
export class RazorpayController {
    constructor(private readonly razorpayService: RazorpayService) { }
    @Post('checkout')
    async checkout(@Body() data: any) {
        console.log("DATA checkout", data)
        const order = await this.razorpayService.checkout(data)
        console.log("ORder: ", order)
        return order;
    }

    @Post('payment-success')
    async paymentSuccessfulControl(@Body() data: any, @Res() res: Response) {
        const res_obj = await this.razorpayService.payment_success(data)
        return res.redirect(res_obj.url);
    }
}