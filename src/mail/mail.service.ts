import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {User} from "../users/entities/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailService {
    constructor(
        private configService: ConfigService,
        private mailerService: MailerService
    ) {
    }

    sendUserConfirmation(user: User, token: string) {
        const url = `${this.configService.get('app.url')}/auth/confirm?token=${token}`;

        return this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to App! Confirm your Email',
            template: 'user-confirmation',
            context: {
                name: user.name,
                email: user.email,
                email_admin: this.configService.get('email.fromAddress'),
                url,
            },
        });
    }
}
