import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { RoutesModule } from './modules/routes.module';
import { AppController } from './app.controller';
import { LoggerMiddleware } from '@middlewares/logger';
import { AuthModule } from './modules/auth/auth.module';

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
