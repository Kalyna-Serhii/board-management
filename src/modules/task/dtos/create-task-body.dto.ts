import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import type { TransformFnParams } from 'class-transformer'

import { Trim } from '../../shared/decorators/trim.decorator'
import { TaskStatus } from '../../shared/enums/task-status.enum'

export class CreateTaskBodyDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Some title' })
  title: string

  @Trim()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ example: 'Some description' })
  description?: string

  @IsEnum(TaskStatus)
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: TaskStatus.PENDING, default: TaskStatus.PENDING })
  status: TaskStatus

  @Transform(({ value }: TransformFnParams) => decodeURIComponent(value))
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ example: 'Tue Aug 20 2024 12:00:00 GMT+0300' })
  due_date?: Date
}
