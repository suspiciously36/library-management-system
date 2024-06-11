import { Injectable } from '@nestjs/common';
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

  findAllAuthor(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  findOneAuthor(id: number) {
    return this.authorRepository.findOneBy({ id });
  }

  updateAuthor(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author: Author = new Author();
    author.name = updateAuthorDto.name;
    author.id = id;
    return this.authorRepository.save(author);
  }

  removeAuthor(id: number) {
    return this.authorRepository.delete({ id });
  }
}
