import { Module } from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {MatchFieldRule} from "./rules/match-field.rule";

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        MatchFieldRule
    ],
})
export class AuthModule {}
