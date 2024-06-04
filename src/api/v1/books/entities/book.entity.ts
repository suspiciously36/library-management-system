import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';

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

  @Column({ type: 'varchar', length: 20 })
  isbn: string;

  @Column({ type: 'int' })
  publication_year: number;

  @ManyToOne(() => Author, (author: Author) => author.books)
  author: Author;
}
