import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
// import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    console.log('hello from local str constructor');
    super();
  }
  async validate(email: string, password: string): Promise<any> {
    console.log('hello from validate func');
    try {
      const user = await this.userService.getUser(email, password);
      if (!user) {
        throw new UnauthorizedException(
          `User with email ${email} is not found`,
        );
      }
      return user;
    } catch (err) {
      throw err;
    }
  }
}
