import {User} from "../../users/entities/user.entity";

export class UserRegisterEvent {
    constructor(public user: User) {
    }
}

export const ON_USER_REGISTERED = 'user.registered'