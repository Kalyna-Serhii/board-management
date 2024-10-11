import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { TokenService } from 'src/modules/token/token.service'
import { UserController } from 'src/modules/user/user.controller'
import { User, UserSchema } from 'src/modules/user/user.entity'
import { UserService } from 'src/modules/user/user.service'

import { Token, TokenSchema } from '../token/token.entity'

@Module({
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService],
})
export class UserModule {}
