import {Body, Controller, Get, HttpCode, Patch, Post, Query, Session, UseGuards} from '@nestjs/common';
import {CredentialDto} from "./dto/credential.dto";
import {AuthService} from "./auth.service";
import {AuthGuard} from "../guards/auth.guard";
import {User} from "../users/entities/user.entity";
import {CurrentUser} from "../users/decorators/current-user.decorator";
import {RegisterUserDto} from "./dto/register-user.dto";
import {TokenQueryDto} from "./dto/token-query.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('auth')
    async login(@Body() body: CredentialDto, @Session() session: any) {
        const user = await this.authService.login(body.username, body.password);
        session.userId = user.id;

        return user;
    }

    @Post('register')
    async register(@Body() body: RegisterUserDto) {
        return await this.authService.register(body);
    }

    @Get('auth/confirm')
    async confirm(@Query() query: TokenQueryDto) {
        return await this.authService.confirmAccount(query.token);
    }

    @Post('auth/forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return await this.authService.forgotPassword(email);
    }

    @Patch('auth/reset-password')
    async resetPassword(@Body() body: ResetPasswordDto, @Query() query: TokenQueryDto) {
        return await this.authService.resetPassword(body.newPassword, query.token);
    }

    @Post('logout')
    @HttpCode(204)
    logout(@Session() session: any) {
        session.userId = null;
    }

    @Get('me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user: User) {
        return user;
    }
}
