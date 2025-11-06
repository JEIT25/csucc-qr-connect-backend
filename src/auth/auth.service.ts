import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employee } from 'src/employee/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private employeeService: EmployeeService) {}

  async createJwt(employee: Employee) {
    //creates the jwt using empid
    const jwt = await this.jwtService.signAsync({
      empid: employee.empid,
      role: employee.role,
    });

    return jwt;
  }

  async decryptJwt(cookie: string) {
    const { empid, role } = await this.jwtService.verifyAsync(cookie); //get the decrpyted value of the cookie(id and role of employee)
    return {
      empid: empid,
      role: role,
    };
  }
}
