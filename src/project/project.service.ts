import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, EditProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects(userId: string) {
    try {
      const projects = await this.prisma.project.findMany({
        where: {
          userId,
        },
      });

      return projects;
    } catch (err) {
      throw err;
    }
  }

  async getProjectById(userId: string, projectId: number) {
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) throw new NotFoundException('Project ded:(');

      if (project.userId !== userId)
        throw new ForbiddenException(`${userId} is ded`);

      return project;
    } catch (err) {
      throw err;
    }
  }

  async createProject(userId: string, dto: CreateProjectDto) {
    // const ownerId = await this.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    const projectToCreate = await this.prisma.project.create({
      data: {
        userId,

        ...dto,
      },
    });

    return projectToCreate;
  }

  async editProjectById(
    userId: string,
    projectId: number,
    dto: EditProjectDto,
  ) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project || project.userId !== userId)
      throw new ForbiddenException(
        'Access denied: project does not exist, or user provided invalid credentials',
      );

    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProjectById(userId: string, projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project || project.userId !== userId)
      throw new ForbiddenException(
        'Access denied; Project does not exist or user provided invalid credentials',
      );

    return await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }
}
