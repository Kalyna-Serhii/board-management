import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

import { TaskStatus } from '../../shared/enums/task-status.enum'

export class TaskResponseDto {
  @ApiProperty({ example: '645013e9a6a1948d3b16fdd1' })
  _id?: Types.ObjectId

  @ApiProperty({ example: 'Some title' })
  title: string

  @ApiProperty({ example: 'Some description' })
  description?: string

  @ApiProperty({ example: TaskStatus.PENDING })
  status: TaskStatus

  @ApiProperty({ example: 'Tue Aug 20 2024 12:00:00 GMT+0300' })
  due_date: Date
}
