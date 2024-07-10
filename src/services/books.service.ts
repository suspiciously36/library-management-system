import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from 'src/dto/books/create-book.dto';
import { UpdateBookDto } from 'src/dto/books/update-book.dto';
import { SearchBookDto } from '../dto/books/search-book.dto';
import { Transaction } from '../entities/transaction.entity';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  // CRUD

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const existingBookTitle = await this.bookRepository.findOne({
      where: { title: createBookDto.title },
    });
    if (existingBookTitle) {
      throw new ConflictException('Book with this title already exists');
    }
    const existingBookISBN = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });
    if (existingBookISBN) {
      throw new ConflictException('Book with this ISBN already exists');
    }
    const year = new Date().getFullYear();
    if (createBookDto.publication_year > year) {
      throw new ConflictException(
        'Publication year should not be in the future',
      );
    }
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

  async findAllBook(): Promise<{ books: Book[]; total: number }> {
    const books = await this.bookRepository.find();
    if (!books || !books.length) {
      throw new NotFoundException('Books not found.');
    }
    const total = books.length;
    return { books, total };
  }

  async findOneBook(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    return book;
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    const books = await this.bookRepository.find();
    for (let i = 0; i < books.length; i++) {
      if (updateBookDto.isbn === books[i].isbn) {
        throw new ConflictException('Book with this ISBN already exists');
      }
      if (updateBookDto.title === books[i].title) {
        throw new ConflictException('Book with this title already exists');
      }
    }
    const year = new Date().getFullYear();
    if (updateBookDto.publication_year > year) {
      throw new ConflictException(
        'Publication year should not be in the future',
      );
    }
    book.title = updateBookDto.title;
    book.author_id = updateBookDto.author_id;
    book.category_id = updateBookDto.category_id;
    book.copies_available = updateBookDto.copies_available;
    book.total_copies = updateBookDto.total_copies;
    book.isbn = updateBookDto.isbn;
    book.publication_year = updateBookDto.publication_year;
    return this.bookRepository.save(book);
  }

  async removeBook(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    const transactions = await this.transactionRepository.findOne({
      where: { book_id: id },
    });
    if (transactions) {
      throw new ConflictException(
        'This book is under a transaction, cannot delete',
      );
    }
    const reservations = await this.reservationRepository.findOne({
      where: {
        book_id: id,
      },
    });
    if (reservations) {
      throw new ConflictException(
        'This book is under a reservation, cannot delete',
      );
    }
    return this.bookRepository.delete({ id });
  }

  // Business logic
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

  async searchBooks(searchBookDto: SearchBookDto): Promise<Book[]> {
    const { title, author, category, available } = searchBookDto;
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category');

    if (title) {
      query.andWhere('book.title LIKE :title', { title: `%${title}%` });
    }

    if (author) {
      query.andWhere('author.name LIKE :author', { author: `%${author}%` });
    }

    if (category) {
      query.andWhere('category.name LIKE :category', {
        category: `%${category}%`,
      });
    }

    if (available !== undefined) {
      if (available === 'true') {
        query.andWhere('book.copies_available > 0');
      } else if (available === 'false') {
        query.andWhere('book.copies_available = 0');
      }
    }

    return query.getMany();
  }
}
