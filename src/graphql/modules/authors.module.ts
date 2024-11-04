import { Module } from '@nestjs/common';
import { BooksModule } from '../../modules/books.module';
import { AuthorsService } from '../../services/authors.service';
import { AuthorsResolver } from '../resolvers/authors.resolver';

@Module({
  imports: [BooksModule],
  providers: [AuthorsService, AuthorsResolver],
})
export class AuthorsModule {}
