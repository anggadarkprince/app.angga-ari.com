import {Module, ValidationPipe} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthController} from './health/health.controller';
import {TerminusModule} from "@nestjs/terminus";
import {HttpModule} from "@nestjs/axios";
import {ThrottlerModule} from "@nestjs/throttler";
import {ConfigModule, ConfigService} from "@nestjs/config";
import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";
import cookieConfig from "./config/cookie.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from './users/users.module';
import {APP_PIPE} from "@nestjs/core";
import {join} from 'path';

const environment = (process.env.NODE_ENV || 'production');

@Module({
    imports: [
        HttpModule,
        TerminusModule,
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        ConfigModule.forRoot({
            envFilePath: `.env${environment != 'production' ? `.${environment}` : ''}`,
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: [
                appConfig,
                databaseConfig,
                cookieConfig,
            ],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: environment == 'test' ? "sqlite" : "mysql",
                host: configService.get<string>('database.default.host'),
                username: configService.get<string>('database.default.username'),
                password: configService.get<string>('database.default.password'),
                port: +configService.get<number>('database.default.port'),
                database: configService.get<string>('database.default.db'),
                migrationsTableName: 'migrations',
                //migrations: ["src/**/*/migrations/*{.ts,.js}"],
                migrations: ["dist/**/*/migrations/*{.ts,.js}"],
                migrationsRun: false,
                synchronize: false,
                autoLoadEntities: true,
                logging: environment != 'production',
            }),
        }),
        UsersModule,
    ],
    controllers: [AppController, HealthController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true
            })
        }
    ],
})
export class AppModule {
}
