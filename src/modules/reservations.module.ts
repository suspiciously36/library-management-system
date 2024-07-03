import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from '../services/reservations.service';
import { ReservationsController } from '../controllers/reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { BooksModule } from './books.module';
import { CustomerModule } from './customer.module';
import { Book } from '../entities/book.entity';
import { NotificationsModule } from './notifications.module';
import { TransactionsModule } from './transactions.module';
import { SchedulerModule } from './scheduler.module';
import { Customer } from '../entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Book, Customer]),
    forwardRef(() => BooksModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => SchedulerModule),
    NotificationsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
