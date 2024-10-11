import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { Token, TokenSchema } from '../token/token.entity'
import { TokenService } from '../token/token.service'

import { TaskController } from './task.controller'
import { Task, TaskSchema } from './task.entity'
import { TaskService } from './task.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TokenService, JwtService],
  exports: [TaskService],
})
export class TaskModule {}
