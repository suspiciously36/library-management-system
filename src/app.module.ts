import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './api/v1/customer/customer.module';
import { Customer } from './api/v1/customer/entities/customer.entity';
import { BooksModule } from './api/v1/books/books.module';
import { Book } from './api/v1/books/entities/book.entity';
import { AuthorsModule } from './api/v1/authors/authors.module';
import { Author } from './api/v1/authors/entities/author.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'Hiimtuankiet36',
      username: 'postgres',
      entities: [Customer, Book, Author],
      database: 'library_management_database',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    CustomerModule,
    BooksModule,
    AuthorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
