import { IsBoolean, IsInt } from 'class-validator';

export class CreateReservationDto {
  @IsBoolean()
  is_fulfilled: boolean;

  @IsInt()
  book_id: number;

  @IsInt()
  customer_id: number;
}
