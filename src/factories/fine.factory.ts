import { define } from 'typeorm-seeding';
import { Fine } from '../entities/fine.entity';
import { fineData } from './data/fine.data';

define(Fine, (_, context: { index: number }) => {
  const fine = new Fine();
  fine.customer_id = fineData[context.index].customer_id;
  fine.is_paid = fineData[context.index].is_paid;
  fine.overdue_days = fineData[context.index].overdue_days;
  fine.transaction_id = fineData[context.index].transaction_id;
  fine.overdue_rate = fineData[context.index].overdue_rate;
  return fine;
});
