import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFineDto } from '../dto/fines/create-fine.dto';
import { UpdateFineDto } from '../dto/fines/update-fine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fine } from '../entities/fine.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { NotificationsService } from './notifications.service';
import { CustomerService } from './customer.service';
import * as moment from 'moment';
@Injectable()
export class FineService {
  constructor(
    @InjectRepository(Fine)
    private readonly fineRepository: Repository<Fine>,
    private transactionService: TransactionsService,
    private notificationService: NotificationsService,
    private customerService: CustomerService,
  ) {}

  // Business Logic
  async calculateFine(transaction_id: number): Promise<Fine> {
    const transaction =
      await this.transactionService.findOneTransaction(transaction_id);
    console.log(transaction);

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    if (!transaction.is_returned) {
      throw new Error(
        'Transaction is not returned yet, cannot calculate fine.',
      );
    }

    const dueDate = moment(transaction.due_date);
    const returnDate = moment(transaction.return_date);

    if (!returnDate.isValid()) {
      throw new Error('Invalid or null return_date.');
    }

    const fine = new Fine();
    if (returnDate.isAfter(dueDate)) {
      const numOfOverdueDays = returnDate.diff(dueDate, 'days');
      fine.overdue_days = numOfOverdueDays;
      fine.overdue_fee = fine.overdue_days * 10000; // 10k/day
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
      return this.fineRepository
        .upsert([fine], ['transaction_id'])
        .then((insertResult) => {
          const id = insertResult.identifiers[0].id;
          return this.fineRepository.findOneBy({ id: id });
        });
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
      return this.fineRepository
        .upsert([fine], ['transaction_id'])
        .then((insertResult) => {
          const id = insertResult.identifiers[0].id;
          return this.fineRepository.findOneBy({ id: id });
        });
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

    //Send notif mail
    await this.notificationService.sendPaymentConfirmation(
      customer.email,
      fine.overdue_fee,
    );

    return this.fineRepository
      .upsert([fine], ['transaction_id'])
      .then((insertResult) => {
        const id = insertResult.identifiers[0].id;
        return this.fineRepository.findOneBy({ id: id });
      });
  }

  // CRUD
  createFine(createFineDto: CreateFineDto): Promise<Fine> {
    const fine: Fine = new Fine();
    fine.customer_id = createFineDto.customer_id;
    fine.transaction_id = createFineDto.transaction_id;
    fine.overdue_days = createFineDto.overdue_days;
    fine.overdue_fee = createFineDto.overdue_fee;
    return this.fineRepository.save(fine);
  }

  async findAllFines() {
    const fines = await this.fineRepository.find();
    if (!fines) {
      throw new NotFoundException('Fines not found');
    }
    return fines;
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
    fine.customer_id = updateFineDto.customer_id;
    fine.transaction_id = updateFineDto.transaction_id;
    fine.overdue_days = updateFineDto.overdue_days;
    fine.overdue_fee = updateFineDto.overdue_fee;
    return this.fineRepository.save(fine);
  }

  async removeFine(id: number) {
    const fine = await this.fineRepository.findOneBy({ id });
    if (!fine) {
      throw new NotFoundException('Fine not found');
    }
    return this.fineRepository.delete({ id });
  }
}
