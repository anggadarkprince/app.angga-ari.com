import {User} from "../../users/entities/user.entity";

export class UserForgotPasswordEvent {
    constructor(public user: User) {
    }
}

export const ON_USER_FORGOT_PASSWORD = 'user.forgot-password'