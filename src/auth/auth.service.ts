import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LogsService } from '../logs/logs.service';
import { CreateUserDto } from 'src/users/user.dto';
import { LoginDto } from './login.dto';
import { User } from 'src/types';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logsService: LogsService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) throw new ConflictException('Email already exists');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'user',
    });
    await this.logsService.createLog(
      user._id as Types.ObjectId,
      'register',
      'User registered',
    );
    return {
      message: 'Registration successful',
    };
  }

  async login(loginDto: LoginDto) {
    const user = (await this.usersService.findByEmail(loginDto.email)) as User;
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    await this.logsService.createLog(
      user._id.toString(),
      'login',
      'User logged in',
    );
    return {
      token,
    };
  }
}
