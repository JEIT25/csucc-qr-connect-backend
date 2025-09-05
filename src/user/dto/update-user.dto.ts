import { IsEmail, IsOptional, IsString, MinLength, MaxLength, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1)
  middle_initial?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  extension?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: Date;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  password_confirm?: string;
}
