import { Injectable } from "@nestjs/common";

@Injectable({})
export class UserService {
    create() {
        return {msg: "login succesful"}
    }

    update() {
        return {msg: "Sign up succesful"}
    }
}