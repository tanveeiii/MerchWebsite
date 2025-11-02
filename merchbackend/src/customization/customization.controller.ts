import { Body, Controller, Post, Put } from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { CreateCustomizationDto } from './customization.dto';

@Controller('customization')
export class CustomizationController {
  constructor(private customizationService: CustomizationService) {}
  @Post('add')
  async add(@Body() dto: CreateCustomizationDto) {
    const tag = this.customizationService.add(dto);
    return tag;
  }

  @Put('update')
  async update(@Body() dto: CreateCustomizationDto) {
    const tag = this.customizationService.update(dto);
    return tag;
  }
}
