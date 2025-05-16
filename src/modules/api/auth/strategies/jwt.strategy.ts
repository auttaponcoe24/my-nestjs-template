import { Payload } from '@/shared/interfaces/jwt-payload/payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secretOrKey = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');

    if (!secretOrKey) {
      throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined in the environment variables.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretOrKey,
    });
  }

  async validate(payload: Payload) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    // console.log('Payload:', payload); // ตรวจสอบ payload ค่าที่ถอดจาก token เมื่อมีแนบเข้ามา

    // const user = await this.usersService.getProfile(payload.id)

    // if(!user) throw new NotFoundException('user is not found')

    return payload; // ต้อง return ค่า payload
  }
}
