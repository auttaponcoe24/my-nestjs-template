import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';
import { CustomRequest, Payload } from '@/shared/interfaces/jwt-payload/payload.interface';

@Injectable()
export class AuthService {
  private prisma: PrismaService;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {
    this.prisma = this.prismaService;
  }

  async validate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        provider_email: {
          provider: 'local',
          email,
        },
      },
    });

    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      const { password: _, ...userWithOutPassword } = user;

      return userWithOutPassword;
    }

    return null;
  }

  async validateOAuthGoogle(provider: string, providerId: string, profile: GoogleProfile) {
    try {
      const accountGoogle = await this.userService.createGoogleAccount(
        provider,
        providerId,
        profile,
      );

      if (!accountGoogle?.data?.userId) {
        throw new BadRequestException('Failed to create or find linked Google account.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: accountGoogle.data.userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User not found for userId: ${accountGoogle.data.userId}`);
      }

      return user;
    } catch (error) {
      // Logging (optional)
      console.error('validateOAuthGoogle error:', error);
      // Re-throw to let NestJS handle the exception
      throw error;
    }
  }

  async login(req: CustomRequest) {
    try {
      const { id } = req.user;
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) throw new NotFoundException('user is not found');

      const { password: _, ...userWithOutPassword } = user;
      const payload: Payload = {
        id: user.id,
        email: user?.email ?? '',
        name: user?.name ?? '',
        role: user.role,
      };
      const { accessToken, refreshToken } = await this.generateTokens(payload);

      return { status: true, message: 'login success', accessToken, data: userWithOutPassword };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async generateTokens(user: Payload) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
