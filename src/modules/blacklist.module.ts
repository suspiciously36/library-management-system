import { forwardRef, Module } from '@nestjs/common';
import { BlacklistService } from '../services/blacklist.service';
import { FineModule } from './fine.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fine } from '../entities/fine.entity';
import { Customer } from '../entities/customer.entity';
import { NotificationsModule } from './notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fine, Customer]),
    forwardRef(() => FineModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
