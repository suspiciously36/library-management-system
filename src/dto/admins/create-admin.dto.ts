import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { emailRegEx, passwordRegEx } from '../../common/utils/regex';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(emailRegEx, {
    message: `Wrong email format`,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character`,
  })
  password: string;

  created_at: Date;
  updated_at: Date;
}
