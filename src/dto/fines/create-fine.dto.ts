import { IsBoolean } from 'class-validator';

export class CreateFineDto {
  overdue_days: number;
  overdue_fee: number;

  @IsBoolean()
  is_paid: boolean;
}
