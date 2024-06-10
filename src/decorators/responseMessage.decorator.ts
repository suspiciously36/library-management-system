import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string = 'Success!') =>
  SetMetadata('response_message', message);
