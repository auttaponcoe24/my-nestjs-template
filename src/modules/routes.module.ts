import { RouterModule } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { PrismaModule } from '@modules/database/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';

const importModules = [PrismaModule, AuthModule, UserModule];

@Global() // ทำให้ RoutesModule เป็น Global Module
@Module({
  imports: [
    // ใช้ RouterModule.register เพื่อกำหนดเส้นทางหลัก api และ module ที่เกี่ยวข้อง
    RouterModule.register([
      {
        path: 'api', // เส้นทางหลัก
        children: [...importModules], // โมดูลที่อยู่ภายใต้เส้นทาง api
      },
    ]),
    ...importModules,
  ],
  exports: [...importModules], // ส่งออกโมดูลเพื่อให้สามารถใช้ในโมดูลอื่นๆ ได้
})
export class RoutesModule {}
