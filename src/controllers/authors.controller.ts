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
import { AuthorsService } from '../services/authors.service';
import { CreateAuthorDto } from './../dto/authors/create-author.dto';
import { UpdateAuthorDto } from './../dto/authors/update-author.dto';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';

@Controller('api/v1/authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @ResponseMessage()
  @Post('add')
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.createAuthor(createAuthorDto);
  }

  @ResponseMessage()
  @Get()
  findAll() {
    const authors = this.authorsService.findAllAuthor();
    if (!authors) {
      throw new NotFoundException('Authors not found!');
    }
    return authors;
  }

  @ResponseMessage()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const author = await this.authorsService.findOneAuthor(+id);
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return author;
  }

  @ResponseMessage()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    const author = await this.authorsService.findOneAuthor(+id);
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return this.authorsService.updateAuthor(+id, updateAuthorDto);
  }

  @ResponseMessage()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const author = await this.authorsService.findOneAuthor(+id);
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return this.authorsService.removeAuthor(+id);
  }
}
