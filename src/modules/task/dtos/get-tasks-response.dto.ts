import { ApiProperty } from '@nestjs/swagger'

import { TaskResponseDto } from './task-response.dto'

export class GetTasksResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  tasks: TaskResponseDto[]

  @ApiProperty({ example: 10 })
  totalCount: number
}
