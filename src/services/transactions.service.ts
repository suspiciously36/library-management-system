import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { UpdateTransactionDto } from 'src/dto/transactions/update-transaction.dto';
import { CreateTransactionDto } from 'src/dto/transactions/create-transaction.dto';
import { BooksService } from './books.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private booksService: BooksService,
    private customerService: CustomerService,
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
      throw new Error('There is no such transaction (:id)');
    }

    if (transaction.is_returned) {
      throw new Error('This Transaction is already returned!');
    }

    const returnDate =
      returnData instanceof Date ? returnData : new Date(returnData);

    const dueDate =
      transaction.due_date instanceof Date
        ? transaction.due_date
        : new Date(transaction.due_date);

    transaction.return_date = returnDate;
    transaction.due_date = dueDate;
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
}
