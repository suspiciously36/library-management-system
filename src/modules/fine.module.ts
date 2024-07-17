import { forwardRef, Module } from '@nestjs/common';
import { FineService } from '../services/fine.service';
import { FineController } from '../controllers/fine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fine } from '../entities/fine.entity';
import { TransactionsModule } from './transactions.module';
import { NotificationsModule } from './notifications.module';
import { CustomerModule } from './customer.module';
import { BlacklistModule } from './blacklist.module';
import { Customer } from '../entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fine, Customer]),
    forwardRef(() => TransactionsModule),
    NotificationsModule,
    forwardRef(() => CustomerModule),
    forwardRef(() => BlacklistModule),
  ],
  controllers: [FineController],
  providers: [FineService],
  exports: [FineService],
})
export class FineModule {}
