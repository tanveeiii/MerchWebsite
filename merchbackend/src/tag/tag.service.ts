import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateTagDto } from "./tag.dto";
import slugify from "slugify";

@Injectable({})
export class TagService{
    constructor(private prisma:PrismaService) {}
    async add(dto: CreateTagDto){
        const {tag_name} = dto;
        if(!tag_name) throw new BadRequestException({code: 400, message: "Tag Name not provided"});
        const slug = slugify(tag_name, {lower: true, strict: true});
        const tag = this.prisma.tag.create({
            data: {
                tag_name: tag_name,
                slug: slug,
                created_at: new Date(Date.now())
            }, 
            select: {
                tag_name: true,
                tag_id: true,
                created_at: true
            }
        })
        return {code: 200, message: "Tag added successfully", tag}
    }
}