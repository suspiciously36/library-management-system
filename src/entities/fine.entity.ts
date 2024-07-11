import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Customer } from './customer.entity';

@Entity()
export class Fine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  overdue_days: number;

  @Column('int', { nullable: true })
  overdue_fee: number;

  @Column('int', { nullable: true })
  overdue_rate: number;

  @Column('boolean', { default: false })
  is_paid: boolean;

  @Column('int', { unique: true })
  transaction_id: number;

  @Column('int')
  customer_id: number;

  @ManyToOne(
    () => Transaction,
    (transaction: Transaction) => transaction.fines,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Customer, (customer: Customer) => customer.fines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ default: () => 'current_timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'current_timestamp' })
  updated_at: Date;
}
