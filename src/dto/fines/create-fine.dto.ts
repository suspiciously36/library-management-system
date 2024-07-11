import { IsBoolean } from 'class-validator';

export class CreateFineDto {
  overdue_days: number;
  overdue_fee: number;
  overdue_rate: number;

  @IsBoolean()
  is_paid: boolean;
}
