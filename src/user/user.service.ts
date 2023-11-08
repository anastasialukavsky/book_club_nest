import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { exclude } from 'utils.exlude-pass';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || userId !== user.id)
      throw new ForbiddenException('Access denied: user does not exist');

    const userWithoutPassword = exclude(user, ['password']);

    return userWithoutPassword;
  }

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user)
      throw new ForbiddenException(
        `Access denied: user with ID ${userId} does not exist`,
      );
    const userToUpdate = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    // delete userToUpdate.password;

    const userWithoutPassword = exclude(userToUpdate, ['password']);

    return userWithoutPassword;
  }
}
