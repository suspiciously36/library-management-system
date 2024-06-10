import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';

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
