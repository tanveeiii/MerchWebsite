import { Body, Controller, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./product.dto";

@Controller('product')
export class ProductController{
    constructor(private  productService: ProductService) {}
    @Post('add')
    async add(@Body() dto:CreateProductDto){
        const product = this.productService.add(dto);
        return product;
    }
}