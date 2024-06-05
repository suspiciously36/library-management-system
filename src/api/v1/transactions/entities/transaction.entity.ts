import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  book_id: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'date' })
  issued_date: string;

  @Column({ type: 'date' })
  due_date: string;

  @Column({ type: 'date', nullable: true })
  return_date: string;

  @ManyToOne(() => Customer, (customer: Customer) => customer.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Book, (book: Book) => book.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
