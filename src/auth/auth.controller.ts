import {Body, Controller, Post, Session} from '@nestjs/common';
import {CredentialDto} from "./dto/credential.dto";
import {AuthService} from "./auth.service";

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
}
