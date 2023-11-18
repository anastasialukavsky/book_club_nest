import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// import { User } from '@prisma/client';
import { ExtractJwt, Strategy, VerifyCallback } from 'passport-jwt';
// import { config } from 'dotenv';
// import { User } from '@prisma/client';

// config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    // const jwtSecret = config.get('JWT_SECRET');
    // if (!jwtSecret) {
    //   throw new Error('JWT_SECRET is not defined in the configuration.');
    // }
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_SECRET'),
      callbackURL: 'http://localhost:3333/google/redirect',
      scope: ['email', 'profile'],
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: jwtSecret,
    });
  }

  async validateGoogleUser(
    _access_token: string,
    _refresh_token: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { email, firstName, lastName } = profile;
      const user = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        _access_token,
      };
      // done(null, user);
      return user;
    } catch (err) {
      done(null, err);
    }
  }
}
