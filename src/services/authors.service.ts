import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const existingAuthor = await this.authorRepository.findOne({
      where: { name: createAuthorDto.name },
    });
    if (existingAuthor) {
      throw new ConflictException('Author with this name already exists');
    }
    const author: Author = new Author();
    author.name = createAuthorDto.name;
    return this.authorRepository.save(author);
  }

  async findAllAuthor(): Promise<{ authors: Author[]; total: number }> {
    const authors = await this.authorRepository.find();
    if (!authors || !authors.length) {
      throw new NotFoundException('Authors not found!');
    }
    const total = authors.length;
    return { authors, total };
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
    const existingAuthor = await this.authorRepository.findOne({
      where: { name: updateAuthorDto.name },
    });
    if (existingAuthor) {
      throw new ConflictException('Author name already exists');
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
