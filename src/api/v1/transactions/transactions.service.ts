import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private booksService: BooksService,
    private customerService: CustomerService,
  ) {}
  create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction: Transaction = new Transaction();
    transaction.book_id = createTransactionDto.book_id;
    transaction.customer_id = createTransactionDto.customer_id;
    transaction.due_date = createTransactionDto.due_date;
    transaction.issued_date = createTransactionDto.issued_date;
    transaction.return_date = createTransactionDto.return_date;
    return this.transactionRepository.save(transaction);
  }

  async createTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    console.log(transactionData);

    const book = await this.booksService.findOne(transactionData.book_id);

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

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  findOne(id: number) {
    return this.transactionRepository.findOneBy({ id });
  }

  update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction: Transaction = new Transaction();
    transaction.book_id = updateTransactionDto.book_id;
    transaction.customer_id = updateTransactionDto.customer_id;
    transaction.due_date = updateTransactionDto.due_date;
    transaction.issued_date = updateTransactionDto.issued_date;
    transaction.return_date = updateTransactionDto.return_date;
    return this.transactionRepository.save(transaction);
  }

  remove(id: number) {
    return this.transactionRepository.delete({ id });
  }
}
