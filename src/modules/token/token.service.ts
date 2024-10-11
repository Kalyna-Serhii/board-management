import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { ObjectId } from 'mongodb'
import { Model } from 'mongoose'

import type { UserDto } from '../shared/dtos/user.dto'
import type { GenerateTokensT } from '../shared/types/generate-tokens.type'
import type { UserDocument } from '../user/user.entity'
import type { Types } from 'mongoose'

import { Token } from './token.entity'

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name)

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateTokens<T extends Object>(payload: T): GenerateTokensT {
    try {
      const accessToken = this.jwtService.sign(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '30m',
      })
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '30d',
        secret: this.config.get('JWT_REFRESH_SECRET'),
      })

      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      this.logger.error(`generateTokens: ${error}`)
      throw new InternalServerErrorException('Failed to generate tokens')
    }
  }

  async save(userId: Types.ObjectId, newRefreshToken: string): Promise<void> {
    try {
      const oldToken = await this.tokenModel.findOne({ userId })

      if (oldToken) {
        oldToken.refreshToken = newRefreshToken
        await oldToken.save()
      } else {
        await this.tokenModel.create({ userId, refreshToken: newRefreshToken })
      }
    } catch (error) {
      this.logger.error(`create: ${error}`)
      throw new InternalServerErrorException('Failed to save a token')
    }
  }

  async refresh(
    userId: Types.ObjectId,
    oldToken: string,
    newToken: string,
  ): Promise<UserDocument> {
    try {
      return await this.tokenModel.findOneAndUpdate(
        {
          userId,
          refreshToken: oldToken,
        },
        {
          $set: {
            refreshToken: newToken,
          },
        },
        { new: true },
      )
    } catch (error) {
      this.logger.error(`refresh: ${error}`)
      throw new InternalServerErrorException('Failed to refresh a token')
    }
  }

  async remove(userId: Types.ObjectId, refreshToken: string): Promise<Token> {
    try {
      return await this.tokenModel.findOneAndDelete({
        userId: new ObjectId(userId),
        refreshToken,
      })
    } catch (error) {
      this.logger.error(`remove: ${error}`)
      throw new InternalServerErrorException('Failed to remove a token')
    }
  }

  validateAccessToken(token: string): UserDto {
    try {
      return this.jwtService.verify<UserDto>(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      })
    } catch (error) {
      this.logger.error(`validateAccessToken: ${error}`)
      throw new InternalServerErrorException(
        'Failed to validate an access token',
      )
    }
  }

  validateRefreshToken(token: string): UserDto {
    try {
      const userData = this.jwtService.verify<UserDto>(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      })

      return userData
    } catch (error) {
      this.logger.error(`validateRefreshToken: ${error}`)
      throw new InternalServerErrorException(
        'Failed to validate a refresh token',
      )
    }
  }
}
