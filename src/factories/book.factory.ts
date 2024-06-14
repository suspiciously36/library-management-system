import { define } from 'typeorm-seeding';
import { Book } from '../entities/book.entity';
import { Author } from '../entities/author.entity';
import { bookData } from './data/book.data';
import { Category } from '../entities/category.entity';

define(
  Book,
  (_, context: { index: number; author: Author; category: Category }) => {
    const book = new Book();
    book.title = bookData[context.index].title;
    book.author_id = bookData[context.index].author_id;
    book.category_id = bookData[context.index].category_id;
    book.isbn = bookData[context.index].isbn;
    book.copies_available = bookData[context.index].copies_available;
    book.total_copies = bookData[context.index].total_copies;
    book.publication_year = bookData[context.index].publication_year;
    book.author = context.author;
    book.category = context.category;

    return book;
  },
);
