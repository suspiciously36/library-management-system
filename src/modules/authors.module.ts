import { Module } from '@nestjs/common';
import { AuthorsService } from '../services/authors.service';
import { AuthorsController } from '../controllers/authors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
