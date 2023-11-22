import {
  Body,
  Controller,
  Get,
  // Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  // Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
// import { Tokens } from './types/index';
// import { Response } from 'express';
// import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GoogleGuard, JwtGuard, LocalAuthGuard, RtGuard } from './guard';
import { GetUser } from './decorators';
import { GetUserId } from './decorators/get-user-id.decorator';
// import { ConfigService } from '@nestjs/config';
// import { AuthGuard } from '@nestjs/passport';
// import { LocalAuthGuard } from './guard/local.auth.guard';
import { Response } from 'express';

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
  async signup(@Body() dto: AuthDto, @Res() res: Response) {
    const { id, tokens } = await this.authService.signup(dto);
    res
      .cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development', //* set to true in production for HTTPS
      })
      .send({ message: 'User successfully signed up', userId: id });

    return { id };
    // return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  // login(@Body() dto: LoginDto, @Res() res: Response) {
  //   // try {
  //   //   const { id } = await this.authService.login(dto, res);

  //   //   console.log({ id });
  //   //   return { id };
  //   // } catch (err) {
  //   //   console.error(err);
  //   //   return err.message;
  //   // }
  //   return this.authService.login(dto, res);
  // }
  // async login(
  //   @Body() dto: LoginDto,
  //   @Req() req: Request,
  // @Res({ passthrough: true }) res: Response,
  // ) {
  //   const { access_token } = await this.authService.login(dto, res, req.user);
  //   res
  //     .cookie('access_token', access_token, {
  //       httpOnly: true,
  //       secure: false,
  //       sameSite: 'lax',
  //       expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
  //     })
  //     .send({ status: 'ok' });
  // }
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { id, tokens } = await this.authService.login(dto);

    // Set the access token as an HTTP-only cookie
    res
      .cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development', //* set to true in production for HTTPS
      })
      .send({ message: 'User successfully logged in', userId: id });

    return { id };
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

  @Get('verify-email/:email')
  async getUserEmail(@Param('email') email: string, @Res() res: Response) {
    try {
      const emailLookup = await this.authService.getUserEmail(email);

      if (emailLookup.status === 200) {
        return res
          .status(HttpStatus.OK)
          .json({ message: emailLookup.message, status: emailLookup.status });
      } else if (emailLookup.status === 404) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: emailLookup.message, status: emailLookup.status });
      }
    } catch (err) {
      throw err;
    }
  }
}
