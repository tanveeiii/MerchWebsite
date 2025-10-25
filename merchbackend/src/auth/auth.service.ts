import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    login() {
        return {msg: "login succesful"}
    }

    signup() {
        return {msg: "Sign up succesful"}
    }
}
