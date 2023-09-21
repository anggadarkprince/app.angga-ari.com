import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  driver: process.env.MAIL_DRIVER || 'smtp',
  host: process.env.MAIL_HOST || '',
  port: process.env.MAIL_PORT || 465,
  username: process.env.MAIL_USERNAME || '',
  password: process.env.MAIL_PASSWORD || '',
  encryption: process.env.MAIL_ENCRYPTION || 'TLS',
  fromName: process.env.MAIL_FROM_NAME || 'Admin',
  fromAddress: process.env.MAIL_FROM_ADDRESS || 'app@mail.com',
}));
