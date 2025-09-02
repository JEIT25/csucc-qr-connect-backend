import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
  IsDateString,
} from 'class-validator';
import { UserType, AccountStatus } from '../user.entity';
export class CreateUserDto {
  @IsEnum(UserType, { message: 'Type must be student, teacher, or admin' })
  @IsOptional() // default = instructor
  type?: UserType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lname: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  fname: string;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  middle_initial?: string;

  @IsOptional()
  @IsString()
  @Length(1, 5)
  extension?: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Birthdate must be a valid date (YYYY-MM-DD)' })
  birth_date: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password_confirm: string;

  @IsEnum(AccountStatus, { message: 'Status must be active or disabled' })
  @IsOptional() // default = ACTIVE
  acc_status?: AccountStatus;
}
