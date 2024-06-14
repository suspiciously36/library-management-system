import { define } from 'typeorm-seeding';
import { Transaction } from '../entities/transaction.entity';
import { transactionData } from './data/transaction.data';
import { Book } from '../entities/book.entity';

define(Transaction, (_, context: { index: number; book: Book }) => {
  const transaction = new Transaction();
  transaction.book_id = transactionData[context.index].book_id;
  transaction.customer_id = transactionData[context.index].customer_id;
  transaction.issued_date = transactionData[context.index].issued_date;
  transaction.due_date = transactionData[context.index].due_date;
  transaction.book = context.book;
  return transaction;
});
