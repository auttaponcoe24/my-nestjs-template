import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@/modules/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

// ✅ Mock bcryptjs module
jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const mockValues = {
                JWT_ACCESS_TOKEN_SECRET: 'access-secret',
                JWT_ACCESS_TOKEN_EXPIRATION_TIME: '1h',
                JWT_REFRESH_TOKEN_SECRET: 'refresh-secret',
                JWT_REFRESH_TOKEN_EXPIRATION_TIME: '7d',
              };
              return mockValues[key];
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            createGoogleAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
  });

  describe('validate', () => {
    it('should return a user without password if credentials are valid', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hashed-password',
        provider: 'local',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true); // ✅ ใช้ mock แบบถูกต้อง

      const result = await service.validate('test@example.com', 'password');

      expect(result).toEqual({
        id: 'user1',
        email: 'test@example.com',
        provider: 'local',
      });
    });
  });
});
