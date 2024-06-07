import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', unique: true, length: 40 })
  email: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
  gender: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'NOW()' })
  updated_at: Date;

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.customer,
  )
  transactions: Transaction[];
}
