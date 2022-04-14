import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {join} from "path";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: `${configService.get('email.driver')}://${configService.get('email.username')}:${configService.get('email.password')}@${configService.get('email.host')}`,
        defaults: {
          from: `"${configService.get('email.fromName')}" <${configService.get('email.fromAddress')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      })
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
