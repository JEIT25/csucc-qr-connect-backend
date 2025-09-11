// src/students/dto/update-student.dto.ts
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { StudMajor, StudLevel } from '../student.entity';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @Length(3, 15)
  @Matches(/^\d{3,}-\d{1,}$/, {
    message: 'Student ID must contain exactly one dash.',
  })
  studid?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastname?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  firstname?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  middlename?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  extname?: string;

  @IsOptional()
  @IsEnum(StudMajor, { message: 'Major must be one of BSEE, BSINFOTECH, EET, BSCpE' })
  studmajor?: StudMajor;

  @IsOptional()
  @IsEnum(StudLevel, { message: 'Level must be one of 1, 2, 3, 4' })
  studlevel?: StudLevel;
}
