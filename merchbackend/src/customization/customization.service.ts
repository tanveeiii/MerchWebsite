import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomizationDto } from './customization.dto';

@Injectable({})
export class CustomizationService {
  constructor(private prisma: PrismaService) {}
  async add(dto: CreateCustomizationDto) {
    // return tag;
  }

  async update(dto: CreateCustomizationDto) {
    // return tag;
  }
}
