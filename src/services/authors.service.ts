import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../entities/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from 'src/dto/authors/create-author.dto';
import { UpdateAuthorDto } from 'src/dto/authors/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author: Author = new Author();
    author.name = createAuthorDto.name;
    return this.authorRepository.save(author);
  }

  async findAllAuthor(): Promise<Author[]> {
    const authors = await this.authorRepository.find();
    if (!authors) {
      throw new NotFoundException('Authors not found!');
    }
    return authors;
  }

  async findOneAuthor(id: number) {
    const author = await this.authorRepository.findOneBy({ id });
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return author;
  }

  async updateAuthor(
    id: number,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    const author = await this.findOneAuthor(id);
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    author.name = updateAuthorDto.name;
    return this.authorRepository.save(author);
  }

  async removeAuthor(id: number) {
    const author = await this.findOneAuthor(id);
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return this.authorRepository.delete({ id });
  }
}
