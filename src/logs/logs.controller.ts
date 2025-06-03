import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('admin/logs')
@Controller('admin/logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all logs' })
  @ApiResponse({ status: 200, description: 'List of logs' })
  async findAll() {
    return this.logsService.findAll();
  }
}
