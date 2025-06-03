import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}

export class UpdateRoleDto {
  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  @IsIn(['user', 'admin'])
  role?: string;
}
