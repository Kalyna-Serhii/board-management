import { ApiProperty } from '@nestjs/swagger'

export class SignUpRejectResponseDto {
  @ApiProperty({ example: 400 })
  status: number

  @ApiProperty({ example: 'Bad Request' })
  message: string
}
