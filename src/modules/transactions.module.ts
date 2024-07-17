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
import { Book } from '../entities/book.entity';
import { Customer } from '../entities/customer.entity';
import { FineModule } from './fine.module';
import { Fine } from '../entities/fine.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Book, Customer, Fine]),
    forwardRef(() => BooksModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => AdminsModule),
    forwardRef(() => ReservationsModule),
    forwardRef(() => FineModule),
    NotificationsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
