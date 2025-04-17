import { days, hours } from '@nestjs/throttler';

const baseCookieConfig = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production', // ใช้ https ใน production
};

const cookieConfig = {
  accessToken: {
    name: 'access_token',
    options: {
      ...baseCookieConfig,
      maxAge: days(30), // อายุคุกกี้ 30 วัน
    },
  },
  refreshToken: {
    name: 'refresh_token',
    options: {
      ...baseCookieConfig,
      maxAge: days(30), // อายุคุกกี้ 30 วัน
    },
  },
  nonce: {
    name: 'nonce',
    options: {
      ...baseCookieConfig,
      maxAge: hours(1), // อายุคุกกี้ 1 ชั่วโมง
    },
  },
};

export default cookieConfig;
