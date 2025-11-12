import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, isString, IsString, ValidateNested } from 'class-validator';

/**
 * Defines the shape of a single record from the uploaded masterlist file.
 */
export class CreateMasterlistDto {

  @IsString()
  @IsOptional()
  SY: string;

  @IsString()
  @IsOptional()
  SEM: string;

  @IsString()
  @IsOptional()
  subjcode: string;

  @IsString()
  @IsOptional()
  section: string;

  @IsString()
  @IsOptional()
  instructor_lastname: string;

  @IsString()
  @IsOptional()
  instructor_firstname: string;
  
  @IsString()  
  @IsOptional()
  instructor_middlename: string;

  @IsString()
  @IsOptional()
  instructor_extname: string;

  @IsString()
  @IsOptional()
  studid: string;

  @IsString()
  @IsOptional()
  stud_lastname: string;

  @IsString()
  @IsOptional()
  stud_firstname: string;

  @IsString()
  @IsOptional()
  stud_middlename: string;

  @IsString()
  @IsOptional()
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
