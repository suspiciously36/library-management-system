import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from 'src/dto/books/create-book.dto';
import { UpdateBookDto } from 'src/dto/books/update-book.dto';

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
    book.total_copies = createBookDto.total_copies;
    book.author_id = createBookDto.author_id;
    book.category_id = createBookDto.category_id;
    book.isbn = createBookDto.isbn;
    book.publication_year = createBookDto.publication_year;
    return this.bookRepository.save(book);
  }

  findAllBook(): Promise<Book[]> {
    const books = this.bookRepository.find();
    if (!books) {
      throw new NotFoundException('Books not found.');
    }
    return books;
  }

  async findOneBook(id: number) {
    const book = await this.findOneBook(id);
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    return this.bookRepository.findOneBy({ id });
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOneBook(id);
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    book.title = updateBookDto.title;
    book.author_id = updateBookDto.author_id;
    book.copies_available = updateBookDto.copies_available;
    book.total_copies = updateBookDto.total_copies;
    book.isbn = updateBookDto.isbn;
    book.publication_year = updateBookDto.publication_year;
    return this.bookRepository.save(book);
  }

  async removeBook(id: number) {
    const book = await this.findOneBook(id);
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    return this.bookRepository.delete({ id });
  }

  async decreaseCopies(book_id: number): Promise<void> {
    const book: Book = await this.findOneBook(book_id);

    if (book) {
      book.copies_available -= 1;
      this.bookRepository.save(book);
    } else {
      throw new NotFoundException('Book not found.');
    }
  }

  async updateCopiesAvailable(
    book_id: number,
    copies_available: number,
  ): Promise<void> {
    await this.bookRepository.update(book_id, { copies_available });
  }
}
