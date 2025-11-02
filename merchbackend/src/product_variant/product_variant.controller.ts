import { Body, Controller, Post } from "@nestjs/common";
import { ProductVariantService } from "./product_variant.service";
import { CreateProductVariantDto } from "./product_variant.dto";

@Controller('product_variant')
export class ProductVariantController{
    constructor(private  productService: ProductVariantService) {}
    @Post('add')
    async add(@Body() dto:CreateProductVariantDto){
        const product = this.productService.add(dto);
        return product;
    }
}