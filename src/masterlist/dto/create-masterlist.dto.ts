import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

/**
 * Defines the shape of a single record from the uploaded masterlist file.
 */
export class CreateMasterlistDto {
  @IsString()
  @IsNotEmpty()
  SY: string;

  @IsString()
  @IsNotEmpty()
  SEM: string;

  @IsString()
  @IsNotEmpty()
  subjcode: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  instructor_lastname: string;

  @IsString()
  @IsNotEmpty()
  instructor_firstname: string;

  @IsString()
  instructor_middlename: string;

  @IsString()
  instructor_extname: string;

  @IsString()
  @IsNotEmpty()
  studid: string;

  @IsString()
  @IsNotEmpty()
  stud_lastname: string;

  @IsString()
  @IsNotEmpty()
  stud_firstname: string;

  @IsString()
  stud_middlename: string;

  @IsString()
  stud_extname: string;
}

/**
 * Defines the shape of the entire upload payload from the frontend.
 */
export class UploadMasterlistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMasterlistDto)
  records: CreateMasterlistDto[];
}
