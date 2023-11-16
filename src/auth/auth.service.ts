import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types/index';
import { exclude } from 'utils.exlude-pass';
// import { UserService } from 'src/user/user.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user)
        throw new NotFoundException(
          `Access denied: user with email ${dto.email} does not exist`,
        );

      const comparePassword = await argon.verify(user.password, dto.password);
      if (!comparePassword)
        throw new ForbiddenException('Access denied: Incorrect password');

      const tokens = await this.signToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (err) {
      throw err;
    }
  }

  async signup(dto: AuthDto): Promise<Tokens> {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      const tokens = await this.signToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new ForbiddenException(`Email ${dto.email} already exists`);
      }
      throw err;
    }
  }

  async updateRtHash(userId: string, rt: string) {
    try {
      const hash = await argon.hash(rt);
      const updateHash = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedRt: hash,
        },
      });

      return updateHash;
    } catch (err) {
      throw err;
    }
  }

  async logout(userId: string) {
    try {
      const userToLogout = await this.prisma.user.update({
        where: {
          id: userId,
          hashedRt: {
            not: null,
          },
        },
        data: {
          hashedRt: null,
        },
      });

      const userWithoutPassword = exclude(userToLogout, ['password']);
      return userWithoutPassword;
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user)
      throw new ForbiddenException('Access denied: token hash does not match');

    if (user.hashedRt) {
      const matchHash = await argon.verify(rt, user.hashedRt);
      if (!matchHash)
        throw new ForbiddenException('Access denied: hash does not match');
    }

    const tokens = await this.signToken(userId, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signToken(userId: string, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };
    const SECRET = this.config.get('JWT_SECRET');
    const REFRESH_SECRET = this.config.get('REFRESH_JWT_SECRET');

    const [token, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: SECRET,
      }),

      this.jwt.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: REFRESH_SECRET,
      }),
    ]);

    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  // async validateUser(userId: string, password: string) {
  //   const user = await this.user.getUserById(userId);
  //   // const matchHash = await argon.verify(password, user.password);
  // }
}
