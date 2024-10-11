import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import type { Types } from 'mongoose'
import type { UserDocument } from 'src/modules/user/user.entity'

import { User } from 'src/modules/user/user.entity'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getByIdAndToken(
    _id: Types.ObjectId,
    refreshToken: string,
  ): Promise<UserDocument> {
    try {
      return await this.userModel.findOne({ _id, refreshToken })
    } catch (error) {
      this.logger.error(`getById: ${error}`)
      throw new InternalServerErrorException('Failed to get user by id')
    }
  }
}
