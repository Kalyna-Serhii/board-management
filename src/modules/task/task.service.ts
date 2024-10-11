import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import type { CreateTaskBodyDto } from './dtos/create-task-body.dto'
import type { GetTasksQueryDto } from './dtos/get-tasks-query.dto'
import type { GetTasksResponseDto } from './dtos/get-tasks-response.dto'
import type { TaskResponseDto } from './dtos/task-response.dto'
import type { UpdateTaskBodyDto } from './dtos/update-task-body.dto'
import type { Types, FilterQuery } from 'mongoose'

import { TaskStatus } from '../shared/enums/task-status.enum'

import { Task } from './task.entity'

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name)

  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getById(_id: Types.ObjectId): Promise<TaskResponseDto> {
    return this.taskModel.findById(_id)
  }

  async getAll({
    filter = TaskStatus.PENDING,
    cursor,
    limit = 10,
  }: GetTasksQueryDto): Promise<GetTasksResponseDto> {
    const query: FilterQuery<Task> = {
      status: filter,
    }

    const totalCount = await this.taskModel.countDocuments(query)

    if (cursor) {
      query._id = { ...query._id, $lt: cursor }
    }

    const tasks = await this.taskModel
      .find(query)
      .sort({ _id: 'desc' })
      .limit(limit)

    return { tasks, totalCount }
  }

  async create(taskDto: CreateTaskBodyDto): Promise<TaskResponseDto> {
    try {
      return await this.taskModel.create(taskDto)
    } catch (error) {
      this.logger.error(`create: ${error}`)
      throw new InternalServerErrorException('Failed to create a task')
    }
  }

  async update(taskDto: UpdateTaskBodyDto): Promise<TaskResponseDto> {
    try {
      return await this.taskModel.findByIdAndUpdate(
        { _id: taskDto._id },
        taskDto,
        { new: true },
      )
    } catch (error) {
      this.logger.error(`update: ${error}`)
      throw new InternalServerErrorException('Failed to update a task')
    }
  }

  async delete(_id: Types.ObjectId): Promise<TaskResponseDto> {
    try {
      return await this.taskModel.findByIdAndDelete(_id)
    } catch (error) {
      this.logger.error(`update: ${error}`)
      throw new InternalServerErrorException('Failed to delete a task')
    }
  }
}
