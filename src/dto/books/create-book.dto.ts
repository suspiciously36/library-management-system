import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
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
