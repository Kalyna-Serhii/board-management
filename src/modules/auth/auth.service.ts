import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model, type Types } from 'mongoose'

import type { AuthUserResponseDto } from '../shared/dtos/auth-user-response.dto'
import type { Token } from '../token/token.entity'
import type { CredentialDto } from 'src/modules/shared/dtos/credential.dto'

import { UserDto } from 'src/modules/shared/dtos/user.dto'
import { User } from 'src/modules/user/user.entity'

import { TokenService } from '../token/token.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly tokenService: TokenService,
  ) {}

  async registration({
    email,
    password,
  }: CredentialDto): Promise<AuthUserResponseDto> {
    try {
      const candidate = await this.userModel.findOne({ email })

      if (candidate) {
        throw new ConflictException(
          `The user with the current address ${email} already exists`,
        )
      }

      const hashedPassword = await bcrypt.hash(password, 3)

      const user = await this.userModel.create({
        email,
        password: hashedPassword,
      })

      const userDto = new UserDto(user)
      const tokens = this.tokenService.generateTokens({ ...userDto })

      await this.tokenService.save(userDto._id, tokens.refreshToken)

      return { ...tokens, user: userDto }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }

      this.logger.error(`registration: ${error}`)
      throw new InternalServerErrorException('Failed to registration')
    }
  }

  async login({
    email,
    password,
  }: CredentialDto): Promise<AuthUserResponseDto> {
    try {
      const user = await this.userModel.findOne({ email })

      if (!user) {
        throw new UnauthorizedException('User with such email was not found')
      }

      const isPassEquals = await bcrypt.compare(password, user.password)

      if (!isPassEquals) {
        throw new UnauthorizedException('Incorrect password')
      }

      const userDto = new UserDto(user)
      const tokens = this.tokenService.generateTokens({ ...userDto })

      await this.tokenService.save(userDto._id, tokens.refreshToken)

      return { ...tokens, user: userDto }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }

      this.logger.error(`login: ${error}`)
      throw new InternalServerErrorException('Failed to login')
    }
  }

  async logout(userId: Types.ObjectId, refreshToken: string): Promise<Token> {
    try {
      const token = await this.tokenService.remove(userId, refreshToken)

      if (!token) {
        throw new NotFoundException('User not found')
      }

      return token
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      this.logger.error(`logout: ${error}`)
      throw new InternalServerErrorException('Failed to logout')
    }
  }

  async refresh(oldRefreshToken: string): Promise<AuthUserResponseDto> {
    try {
      if (!oldRefreshToken) {
        throw new UnauthorizedException()
      }

      const userData = this.tokenService.validateRefreshToken(oldRefreshToken)

      const user = await this.userModel.findById(userData._id)

      const userDto = new UserDto(user)
      const tokens = this.tokenService.generateTokens({ ...userDto })

      await this.tokenService.refresh(
        userDto._id,
        oldRefreshToken,
        tokens.refreshToken,
      )

      return { ...tokens, user: userDto }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }

      this.logger.error(`refresh: ${error}`)
      throw new InternalServerErrorException('Failed to refresh a token')
    }
  }

  async removeExpireTokens(): Promise<void> {
    try {
      const currentTime = Math.floor(Date.now() / 1000)

      await this.userModel.updateMany(
        {},
        { $pull: { tokens: { expire: { $lt: currentTime } } } },
      )
    } catch (error) {
      this.logger.error(`getByRefreshToken: ${error}`)
      throw new InternalServerErrorException('Failed to remove expire token')
    }
  }
}
