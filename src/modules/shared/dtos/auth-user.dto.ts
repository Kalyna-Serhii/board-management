import { IsEmail, IsMongoId, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class AuthUserDto {
  @IsMongoId()
  _id: Types.ObjectId

  @IsString()
  @IsEmail()
  email: string
}
