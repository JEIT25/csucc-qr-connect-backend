import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

/**
 * Defines the shape of a single record from the uploaded masterlist file.
 */
export class CreateMasterlistDto {
  SY: string;

  SEM: string;

  subjcode: string;

  section: string;

  instructor_lastname: string;

  instructor_firstname: string;

  instructor_middlename: string;

  instructor_extname: string;

  studid: string;

  stud_lastname: string;

  stud_firstname: string;

  stud_middlename: string;

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
