import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

export const dateTypeTransformer = (obj: any): moment.Moment => {
  const date = moment(obj);
  if (!date.isValid()) {
    throw new Error('Invalid date format.');
  }
  return date;
};

export const dateTypeChecker = (data: any) => {
  // Ignore data that is not input in PATCH method
  if (data === undefined || data === null) {
    return;
  }

  let date: moment.Moment;
  if (typeof data === 'string') {
    date = moment(data, moment.ISO_8601, true);
    if (!date.isValid()) {
      throw new BadRequestException(
        'Invalid date format: must be in ISO 8601 format.',
      );
    }
  } else if (data instanceof Date) {
    date = moment(data);
  } else {
    throw new BadRequestException('Invalid data format.');
  }
  return date;
};
