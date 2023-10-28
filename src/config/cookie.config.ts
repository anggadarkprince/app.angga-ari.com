import { registerAs } from '@nestjs/config';

export default registerAs('cookie', () => ({
  name: process.env.COOKIE_NAME || 'app_cookie',
  secret: process.env.COOKIE_SECRET || 'secret',
  domain: process.env.COOKIE_DOMAIN || 'localhost',
}));
