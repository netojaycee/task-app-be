import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from './task.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { RequestWithUser } from 'src/types/express';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all tasks for the logged-in user with optional filtering and pagination',
    description:
      'Filter tasks by status, priority, and search for text in title and description. Supports pagination with page and limit parameters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of filtered tasks with pagination metadata',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: {
                type: 'string',
                enum: ['pending', 'in-progress', 'completed'],
              },
              priority: { type: 'string', enum: ['low', 'medium', 'high'] },
              userId: { type: 'string' },
              isDeleted: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(
    @Query() filterDto: TaskFilterDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tasksService.findByUserId(req.user.userId, filterDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  async delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.tasksService.delete(id, req.user.userId);
  }
}
