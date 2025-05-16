import { RouterModule } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '@/db/prisma/prisma.module';
import { AuthModule } from '@/api/auth/auth.module';
import { UserModule } from '@/api/user/user.module';

const importModules = [PrismaModule, AuthModule, UserModule];

@Global() // ทำให้ RoutesModule เป็น Global Module
@Module({
  imports: [
    // ใช้ RouterModule.register เพื่อกำหนดเส้นทางหลัก api และ module ที่เกี่ยวข้อง
    RouterModule.register([
      {
        path: '', // เส้นทางหลัก
        children: [...importModules], // โมดูลที่อยู่ภายใต้เส้นทาง api
      },
    ]),
    ...importModules,
  ],
  exports: [...importModules], // ส่งออกโมดูลเพื่อให้สามารถใช้ในโมดูลอื่นๆ ได้
})
export class RoutesModule {}
