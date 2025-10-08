import { IsString, IsEmail, IsEnum, IsBoolean, IsOptional, Length } from 'class-validator';
import { EmpRole } from '../employee.entity';

export class UpdateEmployeeDto {
  @IsEnum(EmpRole)
  @IsOptional()
  role?: EmpRole;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  lastname?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  firstname?: string;

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
  @IsOptional()
  @Length(6, 100)
  password?: string;

  @IsBoolean()
  @IsOptional()
  isactive?: boolean;
}
