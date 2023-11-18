import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  // UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types/index';
import { exclude } from 'utils.exlude-pass';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
// import { UserService } from 'src/user/user.service';

@Injectable({})
export class AuthService {
  constructor(
    private user: UserService,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  googleLogin(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ) {
    if (!req.user) throw new ForbiddenException('No user returned from Google');

    return {
      message: 'User information from google recieved',
      user: req.user,
    };
  }

  //*user is already in db and his google account was connected to account in our app
  //*user is already in db, but his google account wasn't connected yet to account in our app
  //*user doesn't exist in db
  // async googleLogin(data: any) {
  //   if (!data.user) throw new BadRequestException();

  //   let user = this.prisma.user.findUnique({
  //     where: {
  //       id: data.user.id,
  //     },
  //     select: {
  //       email: true,
  //       password: true,
  //     },
  //   });

  //   if (user) await argon.
  //   return this.login(user);

  //   user = await this.prisma.user.findUnique({
  //     where: {
  //       email: data.user.email,
  //     },
  //   });
  //   await this.login(user);

  //   if (user)
  //     throw new ForbiddenException(
  //       'User already exists, but Google accout was not connected to users account',
  //     );

  //   try {
  //     const newUser = {
  //       // firstName: data.user.firstName,
  //       // lastName: data.user.lastName,
  //       email: data.user.email,
  //       googleId: data.user.id,
  //     };
  //     return this.login(newUser);
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  async login(dto: LoginDto) {
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

      return {
        id: user.id,
      };
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

  async verifyUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user && user.email !== email && user.password !== password)
        return null;
      // throw new UnauthorizedException('Access denied: invalid credentials');

      return user;
    } catch (err) {
      throw err;
    }
  }
}
