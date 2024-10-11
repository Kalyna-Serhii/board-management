import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

import type { UserDocument } from '../../user/user.entity'

export class UserDto {
  @ApiProperty({ example: '61794ba19778e2c4e8428c34' })
  _id?: Types.ObjectId

  @ApiProperty({ example: 'dev@gmail.com' })
  email: string

  constructor(model: UserDocument) {
    this._id = model._id
    this.email = model.email
  }
}
