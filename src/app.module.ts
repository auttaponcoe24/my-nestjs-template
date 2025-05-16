import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { RoutesModule } from './modules/routes.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/api/auth/auth.module';
import { LoggerMiddleware } from '@/middlewares/logger';

@Module({
  imports: [RoutesModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
