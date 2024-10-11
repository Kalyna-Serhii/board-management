import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

import { ConvertToObjectId } from '../../shared/decorators/convert-to-object-id.decorator'

export class DeleteTaskParamDto {
  @ConvertToObjectId()
  @IsNotEmpty()
  @ApiProperty({ example: '645013e9a6a1948d3b16fdd1', type: String })
  _id: Types.ObjectId
}
