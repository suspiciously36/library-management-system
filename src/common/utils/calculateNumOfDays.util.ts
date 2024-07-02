import { dateTypeTransformer } from './dateTypeChecker.util';

export const numOfDaysCalc = (past: any, present: any) => {
  const pastDate = dateTypeTransformer(past);
  const presentDate = dateTypeTransformer(present);
  return Math.abs(presentDate.diff(pastDate, 'days'));
};
