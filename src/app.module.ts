import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import cookieConfig from './config/cookie.config';
import emailConfig from './config/email.config';
import storageConfig from './config/storage.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ShowcasesModule } from './showcases/showcases.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';
import { UtilityModule } from './utility/utility.module';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { ExpertisesModule } from './expertises/expertises.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ContactsModule } from './contacts/contacts.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { validationExceptionFactory } from './common/exceptions/validation-exception';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { ProfileModule } from './profile/profile.module';
import { SettingsModule } from './settings/settings.module';
import * as cookieSession from 'cookie-session';

const environment = process.env.NODE_ENV || 'production';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: `.env${
        environment != 'production' ? `.${environment}` : ''
      }`,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        appConfig,
        databaseConfig,
        cookieConfig,
        emailConfig,
        storageConfig,
        authConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: environment == 'test' ? 'sqlite' : 'mysql',
        host: configService.get<string>('database.default.host'),
        username: configService.get<string>('database.default.username'),
        password: configService.get<string>('database.default.password'),
        port: +configService.get<number>('database.default.port'),
        database: configService.get<string>('database.default.db'),
        migrationsTableName: 'migrations',
        //migrations: ["src/**/*/migrations/*{.ts,.js}"],
        migrations: ['dist/**/*/migrations/*{.ts,.js}'],
        migrationsRun: false,
        synchronize: false,
        autoLoadEntities: true,
        logging: environment != 'production',
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('storage.dest'),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    ShowcasesModule,
    MailModule,
    UtilityModule,
    UploadModule,
    ExpertisesModule,
    ExperiencesModule,
    ContactsModule,
    ProfileModule,
    SettingsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory: validationExceptionFactory,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          name: this.config.get<string>('cookie.name'),
          keys: [this.config.get<string>('cookie.secret')],
        }),
      )
      .forRoutes('*');
  }
}
