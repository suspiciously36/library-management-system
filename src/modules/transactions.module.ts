import { Module } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { TransactionsController } from '../controllers/transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { BooksModule } from './books.module';
import { CustomerModule } from './customer.module';
import { AdminsModule } from './admins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BooksModule,
    CustomerModule,
    AdminsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
