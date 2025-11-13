import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, isString, IsString, ValidateNested } from 'class-validator';

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
  studlastname: string;

  @IsString()
  @IsOptional()
  studfirstname: string;

  @IsString()
  @IsOptional()
  studmiddlename: string;

  @IsString()
  @IsOptional()
  studextname: string;

  @IsString()
  @IsOptional()
  studmajor: string;

  @IsNumber()
  @IsOptional()
  studlevel: number;

  @IsString()
  @IsOptional()
  department: string;

  @IsString()
  @IsOptional()
  college: string;
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
