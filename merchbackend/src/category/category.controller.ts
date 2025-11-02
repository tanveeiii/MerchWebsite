import { Body, Controller, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./category.dto";

@Controller('category')
export class CategoryController{
    constructor(private  categoryService: CategoryService) {}
    @Post('add')
    async add(@Body() dto:CreateCategoryDto){
        const category = this.categoryService.add(dto);
        return category;
    }
}