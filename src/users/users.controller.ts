import {
  Controller,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateRoleDto } from './user.dto';
import { RequestWithUser } from 'src/types/express';

@ApiTags('admin/users')
@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/tasks')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all tasks of a user' })
  @ApiResponse({ status: 200, description: 'List of user tasks' })
  async findUserTasks(@Param('id') id: string) {
    return this.usersService.findUserTasks(id);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user and their tasks' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId; // Assuming req.user contains the authenticated user's info
    return this.usersService.delete(id, userId);
  }

  @Put(':id/role')
  @Roles('admin')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.usersService.updateRole(id, updateRoleDto, userId);
  }
}
