import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'App',
  author: process.env.APP_AUTHOR || 'Angga Ari Wijaya',
  url: process.env.APP_URL || 'http://localhost',
  port: process.env.APP_PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost',
}));
