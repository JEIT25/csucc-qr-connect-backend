import { IsNotEmpty } from 'class-validator';

export class LoginEmployeeDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
