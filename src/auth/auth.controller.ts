import {Body, Controller, Get, HttpCode, Post, Session, UseGuards} from '@nestjs/common';
import {CredentialDto} from "./dto/credential.dto";
import {AuthService} from "./auth.service";
import {AuthGuard} from "../guards/auth.guard";
import {User} from "../users/entities/user.entity";
import {CurrentUser} from "../users/decorators/current-user.decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post()
    async login(@Body() body: CredentialDto, @Session() session: any) {
        const user = await this.authService.login(body.username, body.password);
        session.userId = user.id;

        return user;
    }

    @Post('/logout')
    @HttpCode(204)
    logout(@Session() session: any) {
        session.userId = null;
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user: User) {
        return user;
    }
}
