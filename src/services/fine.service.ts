import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFineDto } from '../dto/fines/update-fine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fine } from '../entities/fine.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { NotificationsService } from './notifications.service';
import { CustomerService } from './customer.service';
import * as moment from 'moment';
import { Customer } from '../entities/customer.entity';
import { BlacklistService } from './blacklist.service';
@Injectable()
export class FineService {
  constructor(
    @InjectRepository(Fine)
    private readonly fineRepository: Repository<Fine>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @Inject(forwardRef(() => TransactionsService))
    private transactionService: TransactionsService,
    private notificationService: NotificationsService,
    private customerService: CustomerService,
    private blacklistService: BlacklistService,
  ) {}

  // Business Logic
  async calculateFine(transaction_id: number): Promise<Fine> {
    const transaction =
      await this.transactionService.findOneTransaction(transaction_id);

    const calculatedFine = await this.fineRepository.findOne({
      where: { transaction_id: transaction.id },
    });
    if (calculatedFine) {
      throw new ConflictException('This fine is already calculated');
    }

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (!transaction.is_returned) {
      throw new Error('Transaction is not returned yet, cannot calculate fine');
    }

    const dueDate = moment(transaction.due_date);
    const returnDate = moment(transaction.return_date);

    if (!returnDate.isValid()) {
      throw new Error('Invalid or null return_date.');
    }

    const fine = new Fine();
    fine.overdue_rate = 1000;
    if (returnDate.isAfter(dueDate)) {
      const numOfOverdueDays = returnDate.diff(dueDate, 'days');
      fine.overdue_days = numOfOverdueDays;
      fine.overdue_fee = fine.overdue_days * fine.overdue_rate; // 10k/day
      fine.customer_id = transaction.customer_id;
      fine.transaction_id = transaction.id;
      const customer = await this.customerService.findOneCustomer(
        fine.customer_id,
      );

      //Send notif mail
      await this.notificationService.sendFineNotification(
        customer.email,
        fine.overdue_fee,
      );
      return this.fineRepository.save(fine);
    } else {
      fine.overdue_days = 0;
      fine.overdue_fee = 0;
      fine.is_paid = true;
      fine.customer_id = transaction.customer_id;
      fine.transaction_id = transaction.id;

      const customer = await this.customerService.findOneCustomer(
        fine.customer_id,
      );

      //Send notif mail
      await this.notificationService.sendOnTimeNotification(customer.email);
      return this.fineRepository.save(fine);
    }
  }

  async payFine(fine_id: number): Promise<Fine> {
    const fine = await this.findOneFine(fine_id);
    if (!fine) {
      throw new NotFoundException('Fine not found.');
    }
    if (fine.is_paid) {
      throw new ConflictException('Fine is already paid.');
    }

    fine.is_paid = true;

    const customer = await this.customerService.findOneCustomer(
      fine.customer_id,
    );

    // De-blacklisting customer who paid the fines
    await this.blacklistService.clearBlacklistStatus(customer.id);

    //Send notif mail
    await this.notificationService.sendPaymentConfirmation(
      customer.email,
      fine.overdue_fee,
    );

    return this.fineRepository.save(fine);
  }

  async dailyFineUpdater(): Promise<void> {
    const unpaidFines = await this.fineRepository.find({
      where: { is_paid: false },
      relations: ['customer'],
    });
    for (const fine of unpaidFines) {
      if (fine.overdue_days < 14) {
        fine.overdue_days += 1;
        fine.overdue_fee = fine.overdue_days * fine.overdue_rate;
        await this.fineRepository.save(fine);
        await this.notificationService.sendDailyFineNotification(
          fine.customer.email,
          fine.overdue_days,
        );
      } else {
        fine.overdue_days += 1;
        fine.overdue_fee = fine.overdue_days * fine.overdue_rate;
        fine.customer.is_blacklisted = true;
        await this.fineRepository.save(fine);
        await this.customerRepository.save(fine.customer);
        if (fine.overdue_days === 15) {
          await this.notificationService.sendBlacklistNotification(
            fine.customer.email,
          );
        }
      }
    }
  }

  // CRUD

  async findAllFines(): Promise<{ fines: Fine[]; total: number }> {
    const fines = await this.fineRepository.find();
    if (!fines || !fines.length) {
      throw new NotFoundException('Fines not found');
    }
    const total = fines.length;
    return { fines, total };
  }

  async findOneFine(id: number) {
    const fine = await this.fineRepository.findOneBy({ id });
    if (!fine) {
      throw new NotFoundException('Fine not found');
    }
    return fine;
  }

  async updateFine(id: number, updateFineDto: UpdateFineDto) {
    const fine = await this.fineRepository.findOneBy({ id });
    if (!fine) {
      throw new NotFoundException('Fine not found');
    }
    const customer = await this.customerRepository.findOneBy({
      id: fine.customer_id,
    });
    fine.overdue_days = updateFineDto.overdue_days;
    fine.overdue_fee = updateFineDto.overdue_days * fine.overdue_rate;
    fine.is_paid = updateFineDto.is_paid;
    if (fine.is_paid) {
      await this.blacklistService.clearBlacklistStatus(customer.id);
    }
    return this.fineRepository.save(fine);
  }

  async removeFine(id: number) {
    const fine = await this.fineRepository.findOneBy({ id });
    if (!fine) {
      throw new NotFoundException('Fine not found');
    }
    if (!fine.is_paid) {
      throw new ConflictException('Fine is not paid, cannot delete');
    }
    return this.fineRepository.delete({ id });
  }
}
