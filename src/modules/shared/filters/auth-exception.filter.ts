import { Catch, HttpStatus, UnauthorizedException } from '@nestjs/common'

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Response } from 'express'

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.UNAUTHORIZED).json({
      message: exception.message,
      status: HttpStatus.UNAUTHORIZED,
    })
  }
}
