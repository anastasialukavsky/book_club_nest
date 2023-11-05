import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

//*POST /api/auth/signup
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup() {
    return 'I am signup';
  }

  @Post('login')
  login() {
    return {
      message: 'I am login',
    };
  }
}
