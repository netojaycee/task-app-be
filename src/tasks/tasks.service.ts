import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from './task.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private logsService: LogsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    // Find the highest position for the current user's tasks
    const highestPositionTask = await this.taskModel
      .findOne({ userId, isDeleted: false })
      .sort({ position: -1 })
      .select('position');

    const nextPosition = highestPositionTask
      ? highestPositionTask.position + 1
      : 0;

    // Create the new task with the next position
    const task = await this.taskModel.create({
      ...createTaskDto,
      userId,
      position: nextPosition,
    });

    await this.logsService.createLog(
      userId,
      'create_task',
      `Task ${task.id} created at position ${nextPosition}`,
    );
    return task;
  }

  async findByUserId(userId: string, filterDto?: TaskFilterDto) {
    const { search, status, priority, page = 1, limit = 10 } = filterDto || {};

    interface TaskQuery {
      userId: string;
      isDeleted: boolean;
      status?: string;
      priority?: string;
      $text?: { $search: string };
      $or?: { title?: RegExp; description?: RegExp }[];
    }

    // Base query
    const query: TaskQuery = { userId, isDeleted: false };

    // Add filters if provided
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // Calculate pagination values
    const skip = (Number(page) - 1) * Number(limit);
    const pageLimit = Number(limit);

    // Try to use text index search first for better performance,
    // fall back to regex if needed for partial matches
    if (search) {
      // For exact phrase matching with text index
      if (search.includes(' ')) {
        query.$text = { $search: `"${search}"` };

        // Get total count first
        const totalCount = await this.taskModel.countDocuments(query);

        // Then get paginated data
        const tasks = await this.taskModel
          .find(query)
          .sort({ score: { $meta: 'textScore' }, position: 1 })
          .skip(skip)
          .limit(pageLimit);

        return {
          data: tasks,
          meta: {
            total: totalCount,
            page: Number(page),
            limit: pageLimit,
            pages: Math.ceil(totalCount / pageLimit),
          },
        };
      }
      // For partial matches use regex
      else {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
    }

    // Get total count for pagination metadata
    const totalCount = await this.taskModel.countDocuments(query);

    // Get paginated tasks
    const tasks = await this.taskModel
      .find(query)
      .sort({ position: 1 }) // Sort by position ascending
      .skip(skip)
      .limit(pageLimit);

    return {
      data: tasks,
      meta: {
        total: totalCount,
        page: Number(page),
        limit: pageLimit,
        pages: Math.ceil(totalCount / pageLimit),
      },
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    try {
      const task = await this.taskModel.findById(id);
      if (!task || task.isDeleted)
        throw new NotFoundException('Task not found');
      if (task.userId !== userId) throw new ForbiddenException('Unauthorized');

      const updatedTask = await this.taskModel.findByIdAndUpdate(
        id,
        updateTaskDto,
        { new: true, runValidators: true },
      );

      await this.logsService.createLog(
        userId,
        'update_task',
        `Task ${id} updated`,
      );

      return {
        message: 'Task updated',
        task: updatedTask,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update task: ${errorMessage}`);
    }
  }

  async delete(id: string, userId: string) {
    const task = await this.taskModel.findById(id);
    if (!task || task.isDeleted) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Unauthorized');

    const deletedPosition = task.position;

    // Mark the task as deleted
    await this.taskModel.updateOne({ _id: id }, { isDeleted: true });

    // Reorder remaining tasks to fill the gap
    await this.taskModel.updateMany(
      {
        userId,
        isDeleted: false,
        position: { $gt: deletedPosition },
      },
      { $inc: { position: -1 } },
    );

    await this.logsService.createLog(
      userId,
      'delete_task',
      `Task ${id} deleted from position ${deletedPosition}`,
    );

    return {
      message: 'Task deleted',
      position: deletedPosition,
    };
  }

  async deleteAllByUserId(userId: string) {
    await this.taskModel.updateMany(
      { userId, isDeleted: false },
      { isDeleted: true },
    );
  }

  async updatePosition(id: string, position: number, userId: string) {
    const task = await this.taskModel.findById(id);
    if (!task || task.isDeleted) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Unauthorized');
    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      { position: Number(position) },
      { new: true, runValidators: true },
    );
    await this.logsService.createLog(
      userId,
      'update_task_position',
      `Task ${id} position updated to ${Number(position)}`,
    );
    return {
      message: 'Task position updated',
      task: updatedTask,
    };
  }
}
