import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { AdminsService } from 'src/services/admins.service';
import { AdminsController } from 'src/controllers/admins.controller';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { SchedulerModule } from './scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    forwardRef(() => SchedulerModule),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AdminsController);
  }
}
