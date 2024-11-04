import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorsService } from '../../services/authors.service';
import { BooksService } from '../../services/books.service';
import { CreateAuthorDto } from '../../dto/authors/create-author.dto';
import { Author } from '../../entities/author.entity';

@Resolver('Author')
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private booksService: BooksService,
  ) {}

  @Query('author')
  async getAuthor(@Args('id') id: number) {
    return this.authorsService.findOneAuthor(id);
  }

  @ResolveField('books')
  async getBooks(@Parent() author) {
    const { id } = author;
    return this.booksService.findAllBookWithAuthorId(id);
  }

  @Mutation()
  async addAuthor(
    @Args('input') createAuthorDto: CreateAuthorDto,
  ): Promise<Author> {
    try {
      const newAuthor =
        await this.authorsService.createAuthorGQL(createAuthorDto);
      if (!newAuthor) {
        throw new Error('Failed to create author');
      }
      return newAuthor;
    } catch (error) {
      console.error('Error in addAuthor resolver:', error);
      throw new Error(`Creation failed: ${error.message}`);
    }
  }
}
