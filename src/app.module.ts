import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './modules/customer.module';
import { Customer } from './entities/customer.entity';
import { BooksModule } from './modules/books.module';
import { Book } from './entities/book.entity';
import { AuthorsModule } from './modules/authors.module';
import { Author } from './entities/author.entity';
import { CategoriesModule } from './modules/categories.module';
import { Category } from './entities/category.entity';
import { TransactionsModule } from './modules/transactions.module';
import { Transaction } from './entities/transaction.entity';
import { AdminsModule } from './modules/admins.module';
import { Admin } from './entities/admin.entity';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'postgres',
      // host: 'localhost',
      // port: 5432,
      // password: 'Hiimtuankiet36',
      // username: 'postgres',
      // entities: [Customer, Book, Author, Category, Transaction, Admin],
      // database: 'library_management_database',
      // synchronize: true,
      // logging: true,
      type: 'sqlite',
      database: 'db/sql',
      entities: [Customer, Book, Author, Category, Transaction, Admin],
      synchronize: true,
    }),
    CustomerModule,
    BooksModule,
    AuthorsModule,
    CategoriesModule,
    TransactionsModule,
    AdminsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
