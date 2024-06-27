import * as moment from 'moment';
import { dateTypeTransformer } from './dateType.transformer';

export const numOfDaysCalc = (past: any, present: any) => {
  const pastDate = dateTypeTransformer(past);
  const presentDate = dateTypeTransformer(present);
  return Math.abs(presentDate.diff(pastDate, 'days'));
};
