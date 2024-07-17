import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Fine } from './fine.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ type: 'varchar', unique: true, length: 40 })
  email: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  reservation_cooldown_timestamp: number;

  @Column({ type: 'int', default: 5, nullable: true })
  reservation_limit: number;

  @Column({ type: 'boolean', default: false })
  is_blacklisted: boolean;

  @CreateDateColumn({ default: () => 'current_timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'current_timestamp' })
  updated_at: Date;

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.customer,
  )
  transactions: Transaction[];

  @OneToMany(() => Fine, (fine: Fine) => fine.customer)
  fines: Fine[];

  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.customer,
  )
  reservations: Reservation[];
}
