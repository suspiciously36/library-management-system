import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from '../services/scheduler.service';
import { ReservationsService } from '../services/reservations.service';
import { TransactionsService } from '../services/transactions.service';
import { SchedulerController } from '../controllers/scheduler.controller';
import { ReservationsModule } from './reservations.module';
import { TransactionsModule } from './transactions.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => ReservationsModule),
    forwardRef(() => TransactionsModule),
  ],
  providers: [SchedulerService],
  controllers: [SchedulerController],
  exports: [SchedulerService],
})
export class SchedulerModule {}
