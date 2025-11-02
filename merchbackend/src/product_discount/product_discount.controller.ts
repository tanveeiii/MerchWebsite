import { Controller } from "@nestjs/common";
import { ProductDiscountService } from "./product_discount.service";
import { CerateProductDiscountDto } from "./product_discount.dto";

@Controller('product_discount')
export class ProductDiscountController{
    constructor(private productDiscountService: ProductDiscountService) {};
    async add(dto: CerateProductDiscountDto){
        const discount = this.productDiscountService.add(dto);
        return discount;
    }
}   