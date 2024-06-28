import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Book } from '../entities/book.entity';
import { bookData } from '../factories/data/book.data';
import { Author } from '../entities/author.entity';
import { Category } from '../entities/category.entity';
import { authorData } from '../factories/data/author.data';
import { categoryData } from '../factories/data/category.data';

export default class CreateBook implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const authors = [];
    for (let i = 0; i < authorData.length; i++) {
      const author = await factory(Author)({ index: i }).create();
      authors.push(author);
    }
    const categories = [];
    for (let i = 0; i < categoryData.length; i++) {
      const category = await factory(Category)({ index: i }).create();
      categories.push(category);
    }

    for (let i = 0; i < bookData.length; i++) {
      await factory(Book)({ index: i, authors, categories }).create();
    }
  }
}
