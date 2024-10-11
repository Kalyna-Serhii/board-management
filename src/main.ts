import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { AuthExceptionFilter } from './modules/shared/filters/auth-exception.filter'
import { HttpExceptionFilter } from './modules/shared/filters/global-error.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter(), new AuthExceptionFilter())

  if (config.get('ENV_MODE') === 'development') {
    const swagger = new DocumentBuilder()
      .setTitle('API')
      .setVersion('1.0')
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, swagger)
    SwaggerModule.setup('api', app, document)
  }

  await app.listen(config.get('PORT'))
}

bootstrap()
