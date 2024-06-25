import { Module, forwardRef } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { TransactionsController } from '../controllers/transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { BooksModule } from './books.module';
import { CustomerModule } from './customer.module';
import { AdminsModule } from './admins.module';
import { ReservationsModule } from './reservations.module';
import { NotificationsModule } from './notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BooksModule,
    forwardRef(() => CustomerModule),
    forwardRef(() => AdminsModule),
    forwardRef(() => ReservationsModule),
    NotificationsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
