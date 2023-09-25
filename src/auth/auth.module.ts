import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MatchFieldRule } from './rules/match-field.rule';
import { UserRegisterListener } from './listeners/user-register.listener';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('auth.secret'),
        signOptions: { expiresIn: configService.get<string>('auth.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MatchFieldRule, UserRegisterListener],
  exports: [JwtModule],
})
export class AuthModule {}
