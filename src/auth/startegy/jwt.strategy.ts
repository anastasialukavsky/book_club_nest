import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get('JWT_SECRET');
    console.log({ jwtSecret });
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      // select: {
      //   id: true,
      //   email: true,
      // },
    });

    if (!user)
      throw new ForbiddenException('Invalid credentials: user does not exist');
    // delete user.password;
    return user;
  }
}
