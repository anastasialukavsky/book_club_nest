import {
  Body,
  Controller,
  Get,
  // Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  // Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { Tokens } from './types/index';
// import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { GoogleGuard, JwtGuard, LocalAuthGuard, RtGuard } from './guard';
import { GetUser } from './decorators';
import { GetUserId } from './decorators/get-user-id.decorator';
// import { ConfigService } from '@nestjs/config';
// import { AuthGuard } from '@nestjs/passport';
// import { LocalAuthGuard } from './guard/local.auth.guard';

//*POST /api/auth/signup
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signInWithGoogle(@Req() req: Request) {}

  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
  ): Promise<{ id: string }> {
    try {
      const { id } = await this.authService.login(dto, res);

      console.log({ id });
      return { id };
    } catch (err) {
      console.error(err);
      return err.message;
    }
    // return this.authService.login(dto, res);
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
