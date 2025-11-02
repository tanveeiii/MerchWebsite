import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateProductDto } from "src/product/product.dto";
import { CerateProductDiscountDto } from "./product_discount.dto";

@Injectable({})
export class ProductDiscountService{
    constructor(private prisma: PrismaService) {}

    async create(dto: CerateProductDiscountDto){
        const {product_id, discount_type, discount_value, start_date, end_date, is_active} = dto;
        if(!product_id || !discount_type || !discount_value || !start_date || !end_date || !is_active)
            throw new BadRequestException({code: 400, message: "Full Data is not provided"});
        const discount = await this.prisma.productDiscount.create({
            data: {
                product_id: product_id,
                discount_type: discount_type,
                discount_value:discount_value,
                start_date: start_date,
                end_date: end_date,
                created_at: new Date(Date.now()),
                is_active: is_active
            },
            select:{
                product_discount_id: true,
                product_id: true,
                discount_type: true,
                discount_value: true,
                start_date: true,
                end_date: true,
                created_at: true,
                is_active: true
            }
        })
        return {code: 200, message: "Discount added", discount};
    }
}