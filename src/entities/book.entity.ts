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
import { Author } from './author.entity';
import { Category } from './category.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  title: string;

  @Column({ type: 'int' })
  author_id: number;

  @Column({ type: 'int' })
  category_id: number;

  @Column({ type: 'int' })
  copies_available: number;

  @Column({ type: 'int', nullable: true })
  total_copies: number;

  @Column({ type: 'varchar', length: 20 })
  isbn: string;

  @Column({ type: 'int' })
  publication_year: number;

  @CreateDateColumn({ default: () => 'current_timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'current_timestamp' })
  updated_at: Date;

  @ManyToOne(() => Author, (author: Author) => author.books, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToOne(() => Category, (category: Category) => category.books, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.book)
  transactions: Transaction[];
}
