import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import * as bcrypt from 'bcrypt';
import { EmployeeService } from 'src/employee/employee.service';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { UpdateEmployeeDto } from 'src/employee/dto/update-employee.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
  ) {}

  //  Employee login
  @Post('login')
  async login(@Body() body: LoginEmployeeDto, @Res({ passthrough: true }) response: Response) {
    const emp = await this.employeeService.findOneBy({ email: body.email });

    if (!emp) {
      throw new NotFoundException('Account was not found.');
    }

    const passwordMatches = await bcrypt.compare(body.password, emp.password);
    if (!passwordMatches) {
      throw new BadRequestException('Account credentials did not match our records.');
    }

    const jwt = await this.authService.createJwt(emp); // sign JWT based on empid and role
    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      success: 'Login successful',
      emp,
    };
  }

  //  Logout
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { success: 'Logout successfully' };
  }

  // Get currently logged-in employee profile
  @UseGuards(AuthGuard)
  @Get('employees/profile')
  async getCurrentEmp(@Req() request: Request) {
    try {
      const payload = await this.authService.decryptJwt(request.cookies.jwt);

      if (!payload) {
        return null;
      }

      const { empid, role } = payload;
      const currentEmp = await this.employeeService.findOneBy({ empid, role });

      if (!currentEmp) {
        return null;
      }

      return currentEmp;
    } catch (err) {
      return null;
    }
  }

  //  Change employee password
  @UseGuards(AuthGuard)
  @Patch('employees/edit/password')
  async editPassword(
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
    @Req() request: Request,
  ) {
    const payload = await this.authService.decryptJwt(request.cookies.jwt);
    const empid = payload?.empid;

    if (!empid) {
      throw new BadRequestException('Invalid session.');
    }

    if (password !== password_confirm) {
      throw new BadRequestException('Password and Password Confirmation do not match.');
    }

    try {
      const hashedPw = await bcrypt.hash(password, 12);
      await this.employeeService.update(empid, { password: hashedPw });
    } catch (err) {
      throw new BadRequestException('Something went wrong, only string values are allowed.');
    }

    return { success: 'Employee password successfully updated.' };
  }

  //  Update employee details (admin only)
  @UseGuards(AuthGuard)
  @Patch('employees/edit')
  async update(@Body() body: UpdateEmployeeDto, @Req() request: Request) {
    try {
      const payload = await this.authService.decryptJwt(request.cookies.jwt);
      const empid = payload?.empid;

      if (!empid) {
        throw new BadRequestException('Invalid session.');
      }

      await this.employeeService.update(empid, body);
      return { success: 'Employee details successfully updated.' };
    } catch (err) {
      return { error: err?.detail || 'Update failed.' };
    }
  }
}
