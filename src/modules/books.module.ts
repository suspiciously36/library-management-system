import { forwardRef, Module } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { BooksController } from '../controllers/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { TransactionsModule } from './transactions.module';
import { Transaction } from '../entities/transaction.entity';
import { Reservation } from '../entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Transaction, Reservation]),
    forwardRef(() => TransactionsModule),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
