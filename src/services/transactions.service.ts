import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { LessThan, Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { UpdateTransactionDto } from 'src/dto/transactions/update-transaction.dto';
import { CreateTransactionDto } from 'src/dto/transactions/create-transaction.dto';
import { BooksService } from './books.service';
import { dateTypeTransformer } from '../common/utils/dateType.transformer';
import { NotificationsService } from './notifications.service';
import { numOfDaysCalc } from '../common/utils/calculateNumOfDays.util';
import * as moment from 'moment';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private booksService: BooksService,
    private customerService: CustomerService,
    private notificationService: NotificationsService,
  ) {}

  createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction: Transaction = new Transaction();
    transaction.book_id = createTransactionDto.book_id;
    transaction.customer_id = createTransactionDto.customer_id;
    transaction.due_date = createTransactionDto.due_date;
    transaction.issued_date = createTransactionDto.issued_date;
    transaction.return_date = createTransactionDto.return_date;
    return this.transactionRepository.save(transaction);
  }

  async findAllTransaction(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find();
    if (!transactions) {
      throw new NotFoundException('Transactions not found.');
    }
    return transactions;
  }

  async findOneTransaction(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    return transaction;
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    transaction.book_id = updateTransactionDto.book_id;
    transaction.customer_id = updateTransactionDto.customer_id;
    transaction.due_date = updateTransactionDto.due_date;
    transaction.issued_date = updateTransactionDto.issued_date;
    transaction.return_date = updateTransactionDto.return_date;
    transaction.is_returned = updateTransactionDto.is_returned;
    return this.transactionRepository.save(transaction);
  }

  async removeTransaction(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    return this.transactionRepository.delete({ id });
  }

  // Business Logic

  async createIssueTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    const book = await this.booksService.findOneBook(transactionData.book_id);

    const customer = await this.customerService.findOneCustomer(
      transactionData.customer_id,
    );

    if (!book || book.copies_available < 1) {
      throw new Error('There is no book available at the moment.');
    }

    const transaction = this.transactionRepository.create(transactionData);
    transaction.book_id = book.id;
    transaction.customer_id = customer.id;

    await this.booksService.decreaseCopies(book.id);
    return this.transactionRepository.save(transactionData);
  }

  async createReturnTransaction(
    id: string,
    returnData: Date,
  ): Promise<Transaction> {
    const transaction = await this.findOneTransaction(+id);

    if (!transaction) {
      throw new ConflictException('There is no such transaction (:id)');
    }

    if (transaction.is_returned) {
      throw new ConflictException('This Transaction is already returned!');
    }

    let returnDate: moment.Moment;

    if (typeof returnData === 'string') {
      returnDate = moment(returnData, moment.ISO_8601, true);
      if (!returnDate.isValid()) {
        throw new BadRequestException(
          'Invalid date format: must be in ISO 8601 format.',
        );
      }
    } else if (returnData instanceof Date) {
      returnDate = moment(returnData);
    } else {
      throw new BadRequestException('Invalid returnData format.');
    }

    const dueDate = moment(transaction.due_date);
    const issuedDate = moment(transaction.issued_date);
    if (returnDate.isBefore(issuedDate)) {
      throw new ConflictException('Return Date cannot be before Issue Date');
    }

    transaction.return_date = returnDate.toDate();
    transaction.due_date = dueDate.toDate();
    transaction.is_returned = true;

    await this.transactionRepository.save(transaction);

    // Updating Book_copiesAvailable
    const bookId = transaction.book_id;
    const book = await this.booksService.findOneBook(bookId);

    if (book.copies_available < book.total_copies) {
      book.copies_available += 1;

      await this.booksService.updateCopiesAvailable(
        book.id,
        book.copies_available,
      );
    }
    return transaction;
  }

  async checkOverdueStatus(): Promise<void> {
    const now = new Date();
    const overdueIssuance = await this.transactionRepository.find({
      where: { due_date: LessThan(now), is_returned: false },
      relations: ['book', 'customer'],
    });

    // MAILER DEMO: ACTIVATE THIS WILL SEND MAIL DEPENDS ON THE CRON EXPRESS

    // for (const issuance of overdueIssuance) {
    //   await this.notificationService.sendOverdueNotification(
    //     issuance.customer.email,
    //     issuance.book.title,
    //     numOfDaysCalc(now, issuance.due_date),
    //   );
    // }
  }
}
