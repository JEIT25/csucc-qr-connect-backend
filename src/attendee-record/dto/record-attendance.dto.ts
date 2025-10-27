import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RecordAttendanceDto {
  @IsString()
  @IsNotEmpty()
  sy: string;

  @IsString()
  @IsNotEmpty()
  sem: string;

  @IsString()
  @IsNotEmpty()
  subjcode: string;

  @IsNumber()
  empid: number;

  @IsString()
  @IsNotEmpty()
  studid: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['check-in', 'check-out'])
  recordType: string;

  @IsString()
  @IsNotEmpty()
  type: string; // 'Class' or 'Consultation'
}
