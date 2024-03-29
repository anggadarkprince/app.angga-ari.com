import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Contact } from '../contacts/entities/contact.entity';

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  /**
   * Send email confirmation when user register for the first time.
   *
   * @param user
   * @param token
   */
  sendUserConfirmation(user: User, token: string) {
    const frontendUrl = this.configService.get('app.frontendUrl');
    const url = `${frontendUrl}/confirm?token=${token}`;

    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to App! Confirm your Email',
      template: './user-confirmation',
      context: {
        name: user.name,
        email: user.email,
        email_admin: this.configService.get('email.fromAddress'),
        url,
      },
    });
  }

  /**
   * Send email reset password when user forgot the password.
   *
   * @param user
   * @param token
   */
  sendResetPasswordLink(user: User, token: string) {
    const frontendUrl = this.configService.get('app.frontendUrl');
    const url = `${frontendUrl}/reset-password?token=${token}`;

    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot password link',
      template: './forgot-password',
      context: {
        name: user.name,
        email: user.email,
        email_admin: this.configService.get('email.fromAddress'),
        url,
      },
    });
  }

  replyContactMessage(contact: Contact, title: string, message: string) {
    return this.mailerService.sendMail({
      to: contact.email,
      subject: title,
      template: './reply-message',
      context: {
        name: contact.name,
        email: contact.email,
        email_admin: this.configService.get('email.fromAddress'),
        message: message,
      },
    });
  }
}
