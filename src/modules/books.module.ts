import { Module } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { BooksController } from '../controllers/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
