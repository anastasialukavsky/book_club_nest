import {
  Body,
  Controller,
  // Get,
  HttpCode,
  HttpStatus,
  Post,
  // Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { Tokens } from './types/index';
// import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';
import { JwtGuard, RtGuard } from './guard';
import { GetUser } from './decorators';
import { GetUserId } from './decorators/get-user-id.decorator';

//*POST /api/auth/signup
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  // @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetUser('hashedRt') refreshToken: string,
    @GetUserId() userId: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
