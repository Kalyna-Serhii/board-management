import { Controller } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { RejectResponseDto } from '../shared/dtos/reject-response.dto'

import { UserService } from './user.service'

@Controller()
@ApiResponse({
  status: 401,
  type: RejectResponseDto,
})
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
