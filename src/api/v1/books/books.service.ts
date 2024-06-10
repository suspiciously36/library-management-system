import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  createBook(createBookDto: CreateBookDto): Promise<Book> {
    const book: Book = new Book();
    book.title = createBookDto.title;
    book.copies_available = createBookDto.copies_available;
    book.author_id = createBookDto.author_id;
    book.category_id = createBookDto.category_id;
    book.isbn = createBookDto.isbn;
    book.publication_year = createBookDto.publication_year;
    return this.bookRepository.save(book);
  }

  findAllBook(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  findOneBook(id: number) {
    return this.bookRepository.findOneBy({ id });
  }

  updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book: Book = new Book();
    book.title = updateBookDto.title;
    book.author_id = updateBookDto.author_id;
    book.copies_available = updateBookDto.copies_available;
    book.isbn = updateBookDto.isbn;
    book.publication_year = updateBookDto.publication_year;
    book.id = id;
    return this.bookRepository.save(book);
  }

  removeBook(id: number) {
    return this.bookRepository.delete({ id });
  }

  async decreaseCopies(book_id: number): Promise<void> {
    const book: Book = await this.findOneBook(book_id);

    if (book) {
      book.copies_available -= 1;
      this.bookRepository.save(book);
    }
  }

  async increaseCopies(book_id: number): Promise<void> {
    const book: Book = await this.findOneBook(book_id);

    if (book) {
      book.copies_available += 1;
      this.bookRepository.save(book);
    }
  }
}
