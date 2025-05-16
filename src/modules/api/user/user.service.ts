import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/modules/database/prisma/prisma.service';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private prisma: PrismaService;
  constructor(private readonly prismaService: PrismaService) {
    this.prisma = this.prismaService;
  }

  async create(body: CreateUserDto) {
    const { email, name, password } = body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        provider_email: {
          provider: 'local',
          email,
        },
      },
    });

    if (existingUser) throw new ConflictException('Email User already exists');

    const create = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithOutPassword } = create;
    return { status: true, message: 'create user successfully', data: userWithOutPassword };
  }

  async createGoogleAccount(provider: string, providerId: string, profile: GoogleProfile) {
    const { displayName, emails, photos } = profile;

    const existingUser = await this.prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });

    if (!existingUser) {
      const create = await this.prisma.socialAccount.create({
        data: {
          provider,
          providerId,
          displayName,
          avatarUrl: photos ? photos[0].value : '',
          email: emails ? emails[0].value : '',
          user: {
            create: {
              provider,
              email: emails ? emails[0].value : '',
              name: displayName,
              avatarUrl: photos ? photos[0].value : '',
            },
          },
        },
      });

      return { status: true, message: 'create user successfully', data: create };
    } else {
      const update = await this.prisma.socialAccount.update({
        where: {
          provider_providerId: {
            provider,
            providerId,
          },
        },
        data: {
          provider,
          providerId,
          displayName,
          avatarUrl: photos ? photos[0].value : '',
          email: emails ? emails[0].value : '',
          user: {
            update: {
              provider,
              email: emails ? emails[0].value : '',
              name: displayName,
              avatarUrl: photos ? photos[0].value : '',
            },
          },
        },
      });

      return { status: true, message: 'create user successfully', data: update };
    }
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('user is not found');

    const { password: _, ...userWithOutPassword } = user;

    return { status: true, message: 'get profile successfully', data: userWithOutPassword };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
