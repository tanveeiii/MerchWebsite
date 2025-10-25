import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./create-user-dto";

@Controller('user')
export class UserController {
    constructor (private userService: UserService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() createUserDTO: CreateUserDto){
        const user = await this.userService.create(createUserDTO);
        return {success: true, user};
    }

    @Post('update')
    update(){
        return this.userService.update();
    }
}