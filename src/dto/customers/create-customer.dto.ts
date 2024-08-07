import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { phoneRegEx } from '../../common/utils/regex';

export class CreateCustomerDto {
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(phoneRegEx, {
    message: 'Phone must not contain word',
  })
  phone: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  @IsString()
  address: string;

  reservation_limit: number;

  reservation_cooldown_timestamp: number;

  is_blacklisted: boolean;

  // @IsString()
  // @IsEnum(['f', 'm', 'u'])
  // gender: string;
}
