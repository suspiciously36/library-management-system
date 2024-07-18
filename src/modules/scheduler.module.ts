import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from '../services/scheduler.service';
import { SchedulerController } from '../controllers/scheduler.controller';
import { ReservationsModule } from './reservations.module';
import { TransactionsModule } from './transactions.module';
import { BlacklistModule } from './blacklist.module';
import { FineModule } from './fine.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => ReservationsModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => BlacklistModule),
    forwardRef(() => FineModule),
  ],
  providers: [SchedulerService],
  controllers: [SchedulerController],
  exports: [SchedulerService],
})
export class SchedulerModule {}
