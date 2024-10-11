import { Catch, HttpException } from '@nestjs/common'

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const formattedMessage = this.flattenMessage(exception.message)
    const formattedErrors = this.flattenErrors(exception)

    response.status(status).json({
      status,
      message: formattedMessage,
      errors: formattedErrors,
    })
  }

  private flattenErrors(exception: Record<string, any>): string[] {
    return exception.response.message
  }

  private flattenMessage(message: string[] | string): string {
    return typeof message === 'string' ? message : message.join(' | ')
  }
}
