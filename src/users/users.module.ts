import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {EmailAvailableRule} from "./rules/email-available.rule";
import {UsernameAvailableRule} from "./rules/username-available.rule";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [
        UsersService,
        EmailAvailableRule,
        UsernameAvailableRule
    ]
})
export class UsersModule {
}
