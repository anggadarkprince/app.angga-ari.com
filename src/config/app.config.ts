import {registerAs} from "@nestjs/config";

export default registerAs('app', () => ({
    name: process.env.APP_NAME || 'App',
    author: process.env.APP_AUTHOR || 'Angga Ari Wijaya',
}));
