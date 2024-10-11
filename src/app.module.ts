import * as path from 'path'
import process from 'process'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup'

import { AuthModule } from './modules/auth/auth.module'
import { ConfigValidationService } from './modules/shared/services/config-validation-service'
import { TaskModule } from './modules/task/task.module'
import { TokenModule } from './modules/token/token.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigValidationService.createSchema(),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'src', 'cdn'),
      serveRoot: '/static/cdn',
    }),
    AuthModule,
    TaskModule,
    TokenModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
