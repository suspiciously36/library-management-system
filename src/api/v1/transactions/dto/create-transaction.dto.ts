import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateTransactionDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @IsNotEmpty()
  book_id: number;

  @IsInt()
  @IsNotEmpty()
  customer_id: number;

  @IsString()
  @IsNotEmpty()
  issued_date: string;

  @IsString()
  @IsNotEmpty()
  due_date: string;

  @IsString()
  @IsNotEmpty()
  return_date: string;
}
