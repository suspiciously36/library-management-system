import { IsString, IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Transform } from 'class-transformer';
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
  issued_date: Date;

  @IsString()
  @IsNotEmpty()
  due_date: Date;

  is_returned: boolean;

  @IsDate()
  return_date: Date;
}
