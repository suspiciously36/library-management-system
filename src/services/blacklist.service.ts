import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Fine } from '../entities/fine.entity';
import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { NotificationsService } from './notifications.service';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(Fine)
    private readonly fineRepository: Repository<Fine>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private notificationService: NotificationsService,
  ) {}
  async checkAndUpdateBlacklistStatus(): Promise<void> {
    const blacklistingFines = await this.fineRepository.find({
      where: { is_paid: false, overdue_days: MoreThanOrEqual(14) },
      relations: ['customer'],
    });
    for (const fine of blacklistingFines) {
      fine.customer.is_blacklisted = true;
      await this.customerRepository.save(fine.customer);
      await this.notificationService.sendBlacklistNotification(
        fine.customer.email,
      );
    }
  }
}
