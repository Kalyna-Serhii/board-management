import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { RejectResponseDto } from '../shared/dtos/reject-response.dto'
import { AuthGuard } from '../shared/guards/auth.guard'

import { CreateTaskBodyDto } from './dtos/create-task-body.dto'
import { DeleteTaskParamDto } from './dtos/delete-task-param.dto'
import { GetTasksQueryDto } from './dtos/get-tasks-query.dto'
import { GetTasksResponseDto } from './dtos/get-tasks-response.dto'
import { TaskResponseDto } from './dtos/task-response.dto'
import { UpdateTaskBodyDto } from './dtos/update-task-body.dto'
import { TaskService } from './task.service'

@Controller('task')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  type: RejectResponseDto,
})
@ApiTags('Task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('all')
  @ApiOperation({ summary: 'Create all tasks' })
  @ApiResponse({
    status: 200,
    type: GetTasksResponseDto,
  })
  async getAllTasks(
    @Query() queryDto: GetTasksQueryDto,
  ): Promise<GetTasksResponseDto> {
    if (queryDto.cursor) {
      const existedTask = await this.taskService.getById(queryDto.cursor)

      if (!existedTask) {
        throw new NotFoundException(`Task with ${queryDto.cursor} not found`)
      }
    }

    return this.taskService.getAll(queryDto)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    type: TaskResponseDto,
  })
  async createTask(@Body() body: CreateTaskBodyDto): Promise<TaskResponseDto> {
    return this.taskService.create(body)
  }

  @Put()
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    type: TaskResponseDto,
  })
  async updateTask(@Body() body: UpdateTaskBodyDto): Promise<TaskResponseDto> {
    const existedTask = await this.taskService.getById(body._id)

    if (!existedTask) {
      throw new NotFoundException(`Task with ${body._id} not found`)
    }

    return this.taskService.update(body)
  }

  @Delete('/:_id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 200,
    type: TaskResponseDto,
  })
  async deleteTask(
    @Param() { _id }: DeleteTaskParamDto,
  ): Promise<TaskResponseDto> {
    const existedTask = await this.taskService.getById(_id)

    if (!existedTask) {
      throw new NotFoundException(`Task with ${_id} not found`)
    }

    return this.taskService.delete(_id)
  }
}
