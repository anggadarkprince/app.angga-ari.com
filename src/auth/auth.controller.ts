import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CredentialDto } from './dto/credential.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenQueryDto } from './dto/token-query.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TransformInterceptor } from '../common/interceptors/transformer.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: CredentialDto, @Session() session: any) {
    const data = await this.authService.login(body.username, body.password);
    session.userId = data.data.id;

    return data;
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

  @Post('auth/verify-reset-token')
  async verifyResetToken(@Body('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Patch('auth/reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Query() query: TokenQueryDto,
  ) {
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
