import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsPositive } from 'class-validator'
import { Types } from 'mongoose'

import type { TransformFnParams } from 'class-transformer'

import { ConvertToObjectId } from '../../shared/decorators/convert-to-object-id.decorator'
import { TaskStatus } from '../../shared/enums/task-status.enum'

export class GetTasksQueryDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
  })
  filter: TaskStatus

  @ConvertToObjectId()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: '645013e9a6a1948d3b16fdd1', type: String })
  cursor: Types.ObjectId

  @IsOptional()
  @Transform((value: TransformFnParams) => Number(value.value))
  @IsPositive()
  @ApiPropertyOptional({ example: 10, default: 10 })
  limit: number
}
