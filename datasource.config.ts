import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: configService.get<string>('DATABASE_TYPE') as
    | 'mysql'
    | 'mariadb'
    | 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: +configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_DB'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/**/*/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  synchronize: false,
});
