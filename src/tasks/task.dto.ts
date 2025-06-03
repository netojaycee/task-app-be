import { IsString, IsOptional, IsIn } from 'class-validator';
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
