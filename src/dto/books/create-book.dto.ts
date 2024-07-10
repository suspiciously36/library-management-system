import { IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';
import { isbnRegEx } from '../../common/utils/regex';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(isbnRegEx, { message: 'Wrong isbn format' })
  isbn: string;

  @IsInt()
  @IsNotEmpty()
  copies_available: number;

  @IsInt()
  @IsNotEmpty()
  total_copies: number;

  @IsInt()
  @IsNotEmpty()
  category_id: number;

  @IsInt()
  @IsNotEmpty()
  author_id: number;

  @IsInt()
  @IsNotEmpty()
  publication_year: number;
}
