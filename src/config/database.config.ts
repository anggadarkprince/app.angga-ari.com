import {registerAs} from "@nestjs/config";

export default registerAs('database', () => ({
    default: {
        type: process.env.DATABASE_TYPE || 'mysql',
        host: process.env.DATABASE_HOST || 'localhost',
        username: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
        db: process.env.DATABASE_DB || 'app'
    },
    test: {
        type: process.env.DATABASE_TEST_TYPE || process.env.DATABASE_TYPE,
        host: process.env.DATABASE_TEST_HOST || process.env.DATABASE_HOST,
        username: process.env.DATABASE_TEST_USERNAME || process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_TEST_PASSWORD || process.env.DATABASE_PASSWORD,
        port: parseInt(process.env.DATABASE_PORT, 10) || parseInt(process.env.DATABASE_PORT, 10) || 3306
    },
}));
