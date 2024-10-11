import { Injectable, UnauthorizedException } from '@nestjs/common'

import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { TokenService } from '../../token/token.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()

    const authorizationHeader = req.cookies

    if (!authorizationHeader) {
      throw new UnauthorizedException('Token is undefined')
    }

    const { accessToken } = authorizationHeader
    try {
      req.user = this.tokenService.validateAccessToken(accessToken)
    } catch (error) {
      throw new UnauthorizedException('Invalid AccessToken')
    }

    return true
  }
}
