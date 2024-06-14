import { define } from 'typeorm-seeding';
import { Author } from '../entities/author.entity';
import { authorData } from './data/author.data';

define(Author, (_, context: { index: number }) => {
  const author = new Author();
  author.name = authorData[context.index].name;
  return author;
});
