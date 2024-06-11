import { Module } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from '../services/customer.service';
import { CustomerController } from '../controllers/customer.controller';
import { AdminsModule } from './admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), AdminsModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
