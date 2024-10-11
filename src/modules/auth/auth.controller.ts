import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { AuthService } from 'src/modules/auth/auth.service'
import { THIRTY_DAYS } from 'src/modules/shared/constants/days'
import { AuthUserResponseDto } from 'src/modules/shared/dtos/auth-user-response.dto'
import { CredentialDto } from 'src/modules/shared/dtos/credential.dto'
import { RejectResponseDto } from 'src/modules/shared/dtos/reject-response.dto'

import { THIRTY_MINUTES } from '../shared/constants/minutes'
import { User } from '../shared/decorators/user.decorator'
import { AuthUserDto } from '../shared/dtos/auth-user.dto'
import { AuthGuard } from '../shared/guards/auth.guard'
import { RefreshTokenGuard } from '../shared/guards/refresh-token.guard'

import { SignUpRejectResponseDto } from './dtos/sign-up-reject-response-code.dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register',
  })
  @ApiResponse({
    status: 201,
    type: AuthUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    type: SignUpRejectResponseDto,
  })
  async registration(
    @Body() data: CredentialDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserResponseDto> {
    const userData = await this.authService.registration(data)

    res.cookie('accessToken', userData.accessToken, {
      maxAge: THIRTY_MINUTES,
    })
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    return userData
  }

  @Post('login')
  @ApiOperation({
    summary: 'Log in',
  })
  @ApiResponse({
    status: 200,
    type: AuthUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    type: RejectResponseDto,
  })
  async login(
    @Body() data: CredentialDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserResponseDto> {
    const userData = await this.authService.login(data)

    res.cookie('accessToken', userData.accessToken, {
      maxAge: THIRTY_MINUTES,
    })
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    res.status(200)

    return userData
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Log out',
  })
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({
    status: 401,
    type: RejectResponseDto,
  })
  async logout(
    @Req() req: Request,
    @User() { _id }: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken } = req.cookies

    await this.authService.logout(_id, refreshToken)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    res.status(204)
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Refresh accessToken',
  })
  @ApiResponse({
    status: 200,
    type: AuthUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    type: RejectResponseDto,
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserResponseDto> {
    const { refreshToken } = req.cookies

    const userData = await this.authService.refresh(refreshToken)

    res.cookie('accessToken', userData.accessToken, {
      maxAge: THIRTY_MINUTES,
    })
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    return userData
  }
}
