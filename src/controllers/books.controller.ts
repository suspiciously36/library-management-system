import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { CreateBookDto } from 'src/dto/books/create-book.dto';
import { UpdateBookDto } from 'src/dto/books/update-book.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { SearchBookDto } from '../dto/books/search-book.dto';
import { Book } from '../entities/book.entity';

@Controller('api/v1/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Post('add')
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(createBookDto);
  }

  @ResponseMessage()
  @Get()
  async findAll() {
    return this.booksService.findAllBook();
  }

  @ResponseMessage()
  @Get('search')
  async searchBooks(@Query() searchBookDto: SearchBookDto): Promise<Book[]> {
    return this.booksService.searchBooks(searchBookDto);
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.booksService.findOneBook(+id);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return await this.booksService.updateBook(+id, updateBookDto);
  }

  @UseGuards(AuthGuard)
  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.booksService.removeBook(+id);
  }
}
