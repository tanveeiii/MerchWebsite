import { Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor (private userService: UserService) {}

    @Post('create')
    create(){
        return this.userService.create();
    }

    @Post('update')
    update(){
        return this.userService.update();
    }
}