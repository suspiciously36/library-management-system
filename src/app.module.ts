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
import { CategoriesModule } from './api/v1/categories/categories.module';
import { Category } from './api/v1/categories/entities/category.entity';
import { TransactionsModule } from './api/v1/transactions/transactions.module';
import { Transaction } from './api/v1/transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'Hiimtuankiet36',
      username: 'postgres',
      entities: [Customer, Book, Author, Category, Transaction],
      database: 'library_management_database',
      synchronize: true,
      logging: true,
    }),
    CustomerModule,
    BooksModule,
    AuthorsModule,
    CategoriesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
