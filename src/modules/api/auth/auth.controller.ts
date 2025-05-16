import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CustomRequest } from '@/shared/interfaces/jwt-payload/payload.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const result = await this.userService.create(body);

    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: CustomRequest) {
    const result = await this.authService.login(req);

    return result;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {
    // จะ redirect ไปยัง Google login page
    // console.log('Google Auth initiated');
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req: CustomRequest) {
    // console.log('req=>', req.user);
    const result = await this.authService.login(req);
    // if (result && result.accessToken) {
    //   res.cookie('accessToken', result.accessToken, {
    //     httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'lax',
    //     // maxAge: 1000 * 60 * 60 * 24, // อายุของ cookie (1 วัน)
    //   });
    //   return result.data.role === 'USER'
    //     ? res.redirect(`${process.env.FRONTEND_URL}`)
    //     : res.redirect(`${process.env.FRONTEND_URL}/admin/main`);
    // }
    // throw new UnauthorizedException();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getSession(@Req() req: CustomRequest) {
    const { id } = req.user;
    return await this.userService.getProfile(id);
  }
}
