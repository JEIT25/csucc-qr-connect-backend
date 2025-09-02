// import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength, IsDateString } from 'class-validator';
import { UserType, AccountStatus } from '../user.entity';
export class CreateUserDto {
//   @IsEnum(UserType, { message: 'Type must be student, teacher, or admin' })
//   @IsOptional() // default = instructor
  type?: UserType;

//   @IsString()
//   @IsNotEmpty()
//   @Length(1, 100)
  lname: string;

//   @IsString()
//   @IsNotEmpty()
//   @Length(1, 100)
  fname: string;

//   @IsOptional()
//   @IsString()
//   @Length(1, 1)
  middleInitial?: string;

//   @IsOptional()
//   @IsString()
//   @Length(1, 5)
  extension?: string;

//   @IsDateString({}, { message: 'Birthdate must be a valid date (YYYY-MM-DD)' })
  birthDate: string;

//   @IsEmail({}, { message: 'Email must be valid' })
  email: string;

//   @IsString()
//   @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

//   @IsEnum(AccountStatus, { message: 'Status must be active or disabled' })
//   @IsOptional() // default = ACTIVE
  accStatus?: AccountStatus;
}