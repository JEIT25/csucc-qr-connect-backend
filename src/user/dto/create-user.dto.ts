import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole, AccountStatus } from '../user.entity';
export class CreateUserDto {
  @IsEnum(UserRole, { message: 'Type must be instructor, or admin' })
  @IsOptional() // default = instructor
  role?: UserRole;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lname: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
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
