import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { BooksService } from '../../services/books.service';

@Resolver('Book')
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query()
  async book(@Args('id') id: number) {
    return this.booksService.findOneBook(id);
  }
}
