import type { Request } from 'express';

export interface Payload {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

export interface CustomRequest extends Request {
  user: Payload;
}
