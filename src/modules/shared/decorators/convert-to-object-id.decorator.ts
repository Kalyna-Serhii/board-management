import { BadRequestException } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { isValidObjectId, Types } from 'mongoose'

import type { TransformFnParams } from 'class-transformer'

export function ConvertToObjectId(): PropertyDecorator {
  return Transform((values: TransformFnParams) => {
    if (!isValidObjectId(values.value)) {
      throw new BadRequestException('Value should be a mongodb id')
    }

    return new Types.ObjectId(values.value)
  })
}
