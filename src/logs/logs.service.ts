import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Log } from './log.schema';
import { Request } from 'express';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(
    userId: Types.ObjectId | string,
    action: string,
    details: string,
    req?: Request,
  ) {
    const ipAddress = req?.ip || 'unknown';
    const location = 'Unknown';
    return this.logModel.create({
      userId,
      action,
      details,
      ipAddress,
      location,
    });
  }

  async findAll() {
    return this.logModel.find().populate('userId', 'email');
  }
}
