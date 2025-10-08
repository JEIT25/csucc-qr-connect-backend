import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';
import * as bcrypt from 'bcrypt';
import { EmpRole } from './employee.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, new RoleGuard('admin'))
@Controller('admins/employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  //get all Employees, for now restricted to instructors
  @Get()
  async getEmployees() {
    return this.employeeService.find({ where: { role: 'instructor' } });
  }

  //create new Employee, instructor and admin
  @Post()
  async createEmployee(@Body() body: CreateEmployeeDto) {
    const { password_confirm, password, email, ...data } = body;

    // 1️ Check password confirmation
    if (password !== password_confirm) {
      throw new BadRequestException('Password and Password Confirmation do not match.');
    }

    // 2️ Check if email already exists
    const existingEmployee = await this.employeeService.findOneBy({ email });
    if (existingEmployee) {
      throw new BadRequestException('Email is already in use.');
    }

    // 3️ Hash password
    const hashedPw = await bcrypt.hash(password, 12);

    // 4️ Save new Employee
    const Employee = await this.employeeService.save({
      ...data,
      email,
      password: hashedPw,
    });

    return {
      success: 'Employee successfully created!',
      Employee,
    };
  }

  //delete Employee type instructor only
  @Delete(':emp_id')
  async deleteEmployee(@Param('emp_id') emp_id: number) {
    try {
      const currDeletedusr = await this.employeeService.findOneBy({
        emp_id: emp_id,
        role: EmpRole.INSTRUCTOR, //prevents admin accounts from being delete
      });
      if (!currDeletedusr || currDeletedusr.role == 'admin') {
        throw new BadRequestException(`Employee not found`);
      }

      await this.employeeService.delete(emp_id);
      return {
        success: `Employee has been successfully deleted!`,
        deleted_acc_info: currDeletedusr,
      };
    } catch (err) {
      throw new BadRequestException('The selected instructor account is not found.');
    }
  }

  //get current Employee to edit information from db
  @Get(':emp_id/edit')
  async getEmployeeToEdit(@Param('emp_id') emp_id: number) {
    // Find the existing Employee
    const existingEmployee = await this.employeeService.findOneBy({ emp_id });

    //if Employee not found and is an admin
    if (!existingEmployee || existingEmployee.role == 'admin') {
      throw new NotFoundException({ error: 'The Employee was not found.' });
    }

    // Return success response
    return existingEmployee;
  }

  //edit Employee type instructor including password
  @Patch(':emp_id/edit')
  async editEmployee(@Param('emp_id') emp_id: number, @Body() body: UpdateEmployeeDto) {
    // Find the existing Employee
    const existingEmployee = await this.employeeService.findOneBy({ emp_id });

    //if Employee not found and is an admin
    if (!existingEmployee || existingEmployee.role == 'admin') {
      throw new NotFoundException({ error: 'The Employee was not found.' });
    }

    //  Filter out null, undefined, or empty string values
    const filteredData: any = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) => value !== null && value !== undefined && value !== '',
      ),
    );

    // Handle password change
    if (filteredData.password || filteredData.password_confirm) {
      if (filteredData.password !== filteredData.password_confirm) {
        throw new BadRequestException('Password and Password Confirmation do not match.');
      }

      // Hash the new password
      filteredData.password = await bcrypt.hash(filteredData.password, 12);

      // Remove password_confirm before saving
      delete filteredData.password_confirm;
    }

    //  Perform the update
    await this.employeeService.update(emp_id, filteredData);

    //Fetch the updated record
    const updatedEmployee = await this.employeeService.findOneBy({ emp_id });

    // Return success response
    return {
      success: 'Employee successfully updated.',
      updated_acc: updatedEmployee,
    };
  }
}
