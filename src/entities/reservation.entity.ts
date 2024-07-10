import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Book } from './book.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  is_fulfilled: boolean;

  @Column('int')
  customer_id: number;

  @Column('int')
  book_id: number;

  @Column('date')
  expire_at: Date;

  @CreateDateColumn({ default: () => 'current_timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'current_timestamp' })
  updated_at: Date;

  @ManyToOne(() => Customer, (customer: Customer) => customer.reservations)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Book, (book: Book) => book.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
