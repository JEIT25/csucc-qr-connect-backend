import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  Length,
  IsNotEmpty,
} from 'class-validator';
import { EmpRole } from '../employee.entity';

export class CreateEmployeeDto {
  @IsEnum(EmpRole)
  @IsOptional() // default is instructor
  role?: EmpRole;

  @IsString()
  @Length(1, 100)
  lastname: string;

  @IsString()
  @Length(1, 100)
  firstname: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  middlename?: string;

  @IsString()
  @IsOptional()
  @Length(0, 5)
  extname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password_confirm: string;

  @IsBoolean()
  @IsOptional()
  isactive?: boolean;
}
