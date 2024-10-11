import { ApiProperty } from '@nestjs/swagger'

export class RejectResponseDto {
  @ApiProperty({ example: 401 })
  status: number

  @ApiProperty({ example: 'Unauthorized' })
  message: string
}
