import * as moment from 'moment';

export const dateTypeTransformer = (obj: any): moment.Moment => {
  const date = moment(obj);
  if (!date.isValid()) {
    throw new Error('Invalid date format.');
  }
  return date;
};
