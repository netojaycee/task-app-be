import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private logsService: LogsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = await this.taskModel.create({ ...createTaskDto, userId });
    await this.logsService.createLog(
      userId,
      'create_task',
      `Task ${task.id} created`,
    );
    return task;
  }

  async findByUserId(userId: string) {
    return this.taskModel.find({ userId, isDeleted: false });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.taskModel.findById(id);
    if (!task || task.isDeleted) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Unauthorized');
    await this.taskModel.updateOne({ _id: id }, updateTaskDto);
    await this.logsService.createLog(
      userId,
      'update_task',
      `Task ${id} updated`,
    );
    return { message: 'Task updated' };
  }

  async delete(id: string, userId: string) {
    const task = await this.taskModel.findById(id);
    if (!task || task.isDeleted) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Unauthorized');
    await this.taskModel.updateOne({ _id: id }, { isDeleted: true });
    await this.logsService.createLog(
      userId,
      'delete_task',
      `Task ${id} deleted`,
    );
    return { message: 'Task deleted' };
  }

  async deleteAllByUserId(userId: string) {
    await this.taskModel.updateMany(
      { userId, isDeleted: false },
      { isDeleted: true },
    );
  }
}
