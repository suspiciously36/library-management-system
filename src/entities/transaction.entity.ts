import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Book } from './book.entity';
import { Fine } from './fine.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  book_id: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'date', default: () => 'current_timestamp' })
  issued_date: Date;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'date', nullable: true })
  return_date: Date;

  @Column({ type: 'boolean', default: false })
  is_returned: boolean;

  @CreateDateColumn({ default: () => 'current_timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'current_timestamp' })
  updated_at: Date;

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

  @OneToMany(() => Fine, (fine: Fine) => fine.transaction)
  fines: Fine[];
}
