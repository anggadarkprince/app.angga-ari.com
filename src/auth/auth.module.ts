import { Module } from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {MatchFieldRule} from "./rules/match-field.rule";
import {UserRegisterListener} from "./listeners/user-register.listener";
import {MailModule} from "../mail/mail.module";

@Module({
    imports: [UsersModule, MailModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        MatchFieldRule,
        UserRegisterListener
    ],
})
export class AuthModule {}
