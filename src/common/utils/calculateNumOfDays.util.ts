import { dateTypeTransformer } from './dateType.transformer';

export const numOfDaysCalc = (past: Date, present: Date) => {
  return Math.abs(
    Math.floor(
      (dateTypeTransformer(present).getTime() -
        dateTypeTransformer(past).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
};
