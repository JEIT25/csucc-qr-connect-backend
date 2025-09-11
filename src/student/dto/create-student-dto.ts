import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { StudMajor, StudLevel } from '../student.entity';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsString({ message: 'Student ID must be a string.' })
  @Length(3, 15, { message: 'Student ID must be between 3 and 20 characters.' })
  @Matches(/^\d{3,}-\d{1,}$/, {
    message: 'Student ID must contain exactly one dash.',
  })
  studid: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MaxLength(50)
  lastname: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MaxLength(50)
  firstname: string;

  @IsNotEmpty({ message: 'Middle name is required' })
  @IsString()
  @MaxLength(50)
  middlename: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  extname?: string;

  @IsNotEmpty({ message: 'Student major is required' })
  @IsEnum(StudMajor, { message: 'Major must be one of BSEE, BSINFOTECH, EET, BSCpE' })
  studmajor: StudMajor;
  @IsNotEmpty({ message: 'Student level is required' })
  @Type(() => Number)
  @IsEnum(StudLevel, { message: 'Level must be 1, 2, 3, or 4' })
  studlevel: StudLevel;
}
