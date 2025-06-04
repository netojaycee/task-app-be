import {
  IsString,
  IsOptional,
  IsIn,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['pending', 'in-progress', 'completed'] })
  @IsIn(['pending', 'in-progress', 'completed'])
  status: string;

  @ApiProperty({ enum: ['low', 'medium', 'high'] })
  @IsIn(['low', 'medium', 'high'])
  priority: string;
}

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ['pending', 'in-progress', 'completed'],
    required: false,
  })
  @IsOptional()
  @IsIn(['pending', 'in-progress', 'completed'])
  status?: string;

  @ApiProperty({ enum: ['low', 'medium', 'high'], required: false })
  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}

export class TaskFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    enum: ['pending', 'in-progress', 'completed'],
    required: false,
  })
  @IsOptional()
  @IsIn(['pending', 'in-progress', 'completed'])
  status?: string;

  @ApiProperty({
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number (starts from 1)',
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  limit?: number;
}

export class UpdateTaskPositionDto {
  @ApiProperty({ description: 'New position for the task' })
  @IsNumber()
  @IsNotEmpty()
  position: number;
}
