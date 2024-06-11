import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { CreateBookDto } from 'src/dto/books/create-book.dto';
import { UpdateBookDto } from 'src/dto/books/update-book.dto';

@Controller('api/v1/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ResponseMessage()
  @Post('add')
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(createBookDto);
  }

  @ResponseMessage()
  @Get()
  async findAll() {
    const books = await this.booksService.findAllBook();
    if (!books) {
      throw new NotFoundException('Books not found!');
    }
    return books;
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOneBook(+id);

    if (!book) {
      throw new NotFoundException('Book not found!');
    }

    return book;
  }

  @ResponseMessage()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.booksService.findOneBook(+id);

    if (!book) {
      throw new NotFoundException('Book not found!');
    }

    return await this.booksService.updateBook(+id, updateBookDto);
  }

  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const book = await this.booksService.findOneBook(+id);

    if (!book) {
      throw new NotFoundException('Book not found!');
    }

    return this.booksService.removeBook(+id);
  }
}
