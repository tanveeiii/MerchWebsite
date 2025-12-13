import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CerateProductDiscountDto } from "./product_discount.dto";
import { Decimal } from '@prisma/client/runtime/library';

@Injectable({})
export class ProductDiscountService{
    constructor(private prisma: PrismaService) {}

    async create(dto: CerateProductDiscountDto){
        const {product_id, discount_type, discount_value, start_date, end_date, is_active} = dto;
        
        if(!product_id || !discount_type || discount_value === undefined || !start_date || !end_date)
            throw new BadRequestException({code: 400, message: "Full Data is not provided"});
            
        const discount = await this.prisma.productDiscount.create({
            data: {
                product_id: Number(product_id),
                discount_type: discount_type,
                discount_value: new Decimal(discount_value), // Fix Decimal
                start_date: new Date(start_date), // Ensure Date Object
                end_date: new Date(end_date),     // Ensure Date Object
                created_at: new Date(),
                is_active: Boolean(is_active)
            }
        });
        
        return {code: 200, message: "Discount added", discount};
    }
}