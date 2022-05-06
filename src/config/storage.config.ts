import {registerAs} from "@nestjs/config";

export default registerAs('storage', () => ({
    dest: process.env.STORAGE_DEST || './uploads',
    driver: process.env.STORAGE_DRIVER || 'local',
    s3: {
        endpoint: process.env.S3_ENDPOINT,
        accessKey: process.env.S3_ACCESS_KEY_ID,
        secretKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_DEFAULT_REGION,
        bucket: process.env.S3_BUCKET,
    },
}));
