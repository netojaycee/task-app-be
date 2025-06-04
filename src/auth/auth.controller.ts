import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/user.dto';
import { LoginDto } from './login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/types/express';

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // fine for subdomain ↔ subdomain
      ...(process.env.NODE_ENV === 'production'
        ? { domain: '.bitekitchen.com.ng' }
        : {}),
      path: '/', // send on every request
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify JWT token' })
  @ApiResponse({ status: 200, description: 'Token verified, user returned' })
  @UseGuards(AuthGuard('jwt'))
  verify(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and clear authentication cookie' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('fgkt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      ...(process.env.NODE_ENV === 'production'
        ? { domain: '.bitekitchen.com.ng' }
        : {}),
      path: '/',
    });

    return { message: 'Logout successful' };
  }
}
