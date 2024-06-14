import { IsString, IsInt, IsNotEmpty } from 'class-validator';
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

  @Transform((value) => value.valueOf(), { toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  issued_date: Date;

  @Transform((value) => value.valueOf(), { toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  due_date: Date;

  is_returned: boolean;

  @Transform((value) => value.valueOf(), { toPlainOnly: true })
  return_date: Date;
}
