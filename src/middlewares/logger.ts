import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger = new Logger('Response', { timestamp: true });
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, body, query } = req;

    const reqTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = Date.now();

      // ใช้ originalUrl เพื่อให้รองรับ global prefix
      const url = req.originalUrl;

      if (statusCode < 400) {
        this.logger.log(`${method} ${statusCode} ${url} - ${resTime - reqTime}ms`);
      } else {
        this.logger.warn(`${method} ${statusCode} ${url} - ${resTime - reqTime}ms`);
      }

      const input = JSON.stringify({ method, statusCode, url, query, body }, null, 2);
      this.logger.debug(input);
    });

    next();
  }
}
