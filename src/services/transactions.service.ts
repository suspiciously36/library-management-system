import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { UpdateTransactionDto } from 'src/dto/transactions/update-transaction.dto';
import { CreateTransactionDto } from 'src/dto/transactions/create-transaction.dto';
import { BooksService } from './books.service';
import { NotificationsService } from './notifications.service';
import * as moment from 'moment';
import { dateTypeChecker } from '../common/utils/dateTypeChecker.util';
import { numOfDaysCalc } from '../common/utils/calculateNumOfDays.util';
import { Book } from '../entities/book.entity';
import { Customer } from '../entities/customer.entity';
import { Fine } from '../entities/fine.entity';
import { FineService } from './fine.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private fineService: FineService,
    private booksService: BooksService,
    private notificationService: NotificationsService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Handle Blacklisted Customer
    const blacklistedCustomer = await this.customerRepository.findOne({
      where: { id: createTransactionDto.customer_id, is_blacklisted: true },
    });

    if (blacklistedCustomer) {
      throw new ForbiddenException(
        'This customer is blacklisted due to unpaid fines for more than 14 days, cannot create Transaction',
      );
    }

    const book = await this.bookRepository.findOne({
      where: { id: createTransactionDto.book_id },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const customer = await this.customerRepository.findOne({
      where: { id: createTransactionDto.customer_id },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    // Validating date type
    let returnDate: moment.Moment;
    returnDate = dateTypeChecker(createTransactionDto.return_date);
    let issuedDate: moment.Moment;
    issuedDate = dateTypeChecker(createTransactionDto.issued_date);
    let dueDate: moment.Moment;
    dueDate = dateTypeChecker(createTransactionDto.due_date);

    const transaction: Transaction = new Transaction();

    if (returnDate) {
      if (returnDate.isBefore(createTransactionDto.issued_date)) {
        throw new ConflictException('Return Date cannot be before Issue Date');
      }
    }

    if (dueDate.isBefore(createTransactionDto.issued_date)) {
      throw new ConflictException('Due Date cannot be before Issue Date');
    }

    transaction.book_id = createTransactionDto.book_id;
    transaction.customer_id = createTransactionDto.customer_id;
    transaction.due_date = createTransactionDto.due_date;
    transaction.issued_date = createTransactionDto.issued_date;
    transaction.return_date = createTransactionDto.return_date;

    if (book.copies_available > 0) {
      book.copies_available -= 1;
    } else
      throw new ConflictException(
        'There is no book available right now to create a new transaction',
      );
    await this.bookRepository.save(book);
    return this.transactionRepository.save(transaction);
  }

  async findAllTransaction(): Promise<{
    transactions: Transaction[];
    total: number;
  }> {
    const transactions = await this.transactionRepository.find();
    if (!transactions || !transactions.length) {
      throw new NotFoundException('Transactions not found');
    }
    const total = transactions.length;
    return { transactions, total };
  }

  async findOneTransaction(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    // Handle Blacklisted Customer
    const blacklistedCustomer = await this.customerRepository.findOne({
      where: { id: updateTransactionDto.customer_id, is_blacklisted: true },
    });

    if (blacklistedCustomer) {
      throw new ForbiddenException(
        'This customer is blacklisted due to unpaid fines for more than 14 days, cannot create Transaction',
      );
    }
    const book = await this.bookRepository.findOne({
      where: { id: updateTransactionDto.book_id },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const customer = await this.customerRepository.findOne({
      where: { id: updateTransactionDto.customer_id },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validating date type
    let returnDate: moment.Moment;
    returnDate = dateTypeChecker(updateTransactionDto.return_date);
    let issuedDate: moment.Moment;
    issuedDate = dateTypeChecker(updateTransactionDto.issued_date);
    let dueDate: moment.Moment;
    dueDate = dateTypeChecker(updateTransactionDto.due_date);

    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (returnDate) {
      if (returnDate.isBefore(transaction.issued_date)) {
        throw new ConflictException('Return Date cannot be before Issue Date');
      }
    }

    if (dueDate) {
      if (dueDate.isBefore(transaction.issued_date)) {
        throw new ConflictException('Due Date cannot be before Issue Date');
      }
    }

    if (!transaction.is_returned) {
      if (updateTransactionDto.is_returned) {
        if (!updateTransactionDto.return_date) {
          throw new ConflictException(
            'If is_returned set to true, a return_date must be provided',
          );
        }
        book.copies_available += 1;
        await this.bookRepository.save(book);
      }
    } else {
      if (!updateTransactionDto.is_returned) {
        transaction.return_date = null;
        book.copies_available -= 1;
        await this.bookRepository.save(book);
      }
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
    const transaction = await this.transactionRepository.findOne({
      where: { id: id },
      relations: ['book'],
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.is_returned) {
      throw new ForbiddenException(
        'The transaction is completed, you might not want to delete it',
      );
    } else {
      transaction.book.copies_available += 1;
      await this.bookRepository.save(transaction.book);
    }

    return this.transactionRepository.delete({ id });
  }

  // Business Logic

  async createIssueTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    // Handle Blacklisted Customer
    const blacklistedCustomer = await this.customerRepository.findOne({
      where: { id: transactionData.customer_id, is_blacklisted: true },
    });

    if (blacklistedCustomer) {
      throw new ForbiddenException(
        'This customer is blacklisted due to unpaid fines for more than 14 days, cannot create Transaction',
      );
    }

    const book = await this.booksService.findOneBook(transactionData.book_id);

    dateTypeChecker(transactionData.due_date);

    if (!book || book.copies_available < 1) {
      throw new NotFoundException('There is no book available at the moment.');
    }

    const dueDate = moment(transactionData.due_date);
    const issueDate = moment(transactionData.issued_date);
    if (dueDate.isBefore(issueDate)) {
      throw new ConflictException('Due Date cannot be before Issue Date');
    }

    await this.booksService.decreaseCopies(book.id);
    return this.transactionRepository.save(transactionData);
  }

  async createReturnTransaction(
    id: string,
    returnData: Date,
  ): Promise<Transaction> {
    const transaction = await this.findOneTransaction(+id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.is_returned) {
      throw new ConflictException('This Transaction is already returned!');
    }

    let returnDate: moment.Moment;
    returnDate = dateTypeChecker(returnData);

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

    // MAILER DEMO: ACTIVATE THIS WILL SEND MAIL DEPENDS ON THE CRON EXPRESSION

    for (const issuance of overdueIssuance) {
      await this.fineService.calculateFine(issuance.id);
      await this.notificationService.sendOverdueNotification(
        issuance.customer.email,
        issuance.book.title,
        numOfDaysCalc(now, issuance.due_date),
      );
    }
  }
}
