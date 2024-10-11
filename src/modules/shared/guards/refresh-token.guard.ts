import { Injectable, UnauthorizedException } from '@nestjs/common'

import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { TokenService } from '../../token/token.service'
import { UserService } from '../../user/user.service'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const { refreshToken } = request.cookies

    if (!refreshToken) {
      throw new UnauthorizedException('Token is undefined')
    }

    try {
      const userData = this.tokenService.validateRefreshToken(refreshToken)

      const user = this.userService.getByIdAndToken(userData._id, refreshToken)

      if (!user) throw new Error()
    } catch (error) {
      throw new UnauthorizedException('Invalid RefreshToken')
    }

    return true
  }
}
