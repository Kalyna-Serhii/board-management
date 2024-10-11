import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { Token, TokenSchema } from './token.entity'
import { TokenService } from './token.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],

  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
