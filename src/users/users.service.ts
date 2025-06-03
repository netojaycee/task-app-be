import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto, UpdateRoleDto } from './user.dto';
import { TasksService } from '../tasks/tasks.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private tasksService: TasksService,
    private logsService: LogsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email, isDeleted: false });
  }

  async findAll() {
    return this.userModel.find({ isDeleted: false }).select('-password');
  }

  async findUserTasks(userId: string) {
    return this.tasksService.findByUserId(userId);
  }

  async delete(id: string, adminId: string) {
    const user = await this.userModel.findById(id);
    if (!user || user.isDeleted) throw new NotFoundException('User not found');
    await this.userModel.updateOne({ _id: id }, { isDeleted: true });
    await this.tasksService.deleteAllByUserId(id);
    await this.logsService.createLog(
      adminId,
      'delete_user',
      `User ${id} deleted`,
    );
    return { message: 'User deleted' };
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto, adminId: string) {
    const user = await this.userModel.findById(id);
    if (!user || user.isDeleted) throw new NotFoundException('User not found');
    await this.userModel.updateOne({ _id: id }, { role: updateRoleDto.role });
    await this.logsService.createLog(
      adminId,
      'update_role',
      `User ${id} role updated to ${updateRoleDto.role}`,
    );
    return { message: 'Role updated' };
  }
}
