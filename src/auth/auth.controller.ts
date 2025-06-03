import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/user.dto';
import { LoginDto } from './login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    await this.authService.register(createUserDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'User registered successfully' });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in, token returned' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { token } = await this.authService.login(loginDto);
    res.cookie('fgkt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }
}
