import { Module } from '@nestjs/common';
import { FineService } from '../services/fine.service';
import { FineController } from '../controllers/fine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fine } from '../entities/fine.entity';
import { TransactionsModule } from './transactions.module';
import { NotificationsModule } from './notifications.module';
import { CustomerModule } from './customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fine]),
    TransactionsModule,
    NotificationsModule,
    CustomerModule,
  ],
  controllers: [FineController],
  providers: [FineService],
  exports: [FineService],
})
export class FineModule {}
