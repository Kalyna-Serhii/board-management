import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length } from 'class-validator'

export class CredentialDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com' })
  email: string

  @Length(8)
  @ApiProperty({ example: '12345678' })
  password: string
}
