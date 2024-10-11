import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

import { ConvertToObjectId } from '../../shared/decorators/convert-to-object-id.decorator'

import { CreateTaskBodyDto } from './create-task-body.dto'

export class UpdateTaskBodyDto extends CreateTaskBodyDto {
  @ConvertToObjectId()
  @IsNotEmpty()
  @ApiProperty({ example: '61794ba19778e2c4e8428c34', type: String })
  _id: Types.ObjectId
}
