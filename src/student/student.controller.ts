import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { CreateStudentDto } from './dto/create-student-dto';
import { UpdateStudentDto } from './dto/update-student-dto';

@UseGuards(AuthGuard, new RoleGuard('admin'))
@Controller('admins/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async all() {
    return this.studentService.find({});
  }

  @Get(':studid')
  async get(@Param('studid') studid: number) {
    return this.studentService.findOneBy({ studid });
  }

  @Post()
  async create(@Body() body: CreateStudentDto) {
    //  Filter out null, undefined, or empty string values
    const filteredData = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) => value !== null && value !== undefined && value !== '',
      ),
    );
    return {
      success: 'User successfully created.',
      user: await this.studentService.save({
        filteredData,
      }),
    };
  }

  @Put(':studid')
  async update(@Param('studid') studid: number, @Body() body: UpdateStudentDto) {
    //  Filter out null, undefined, or empty string values
    const filteredData = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) => value !== null && value !== undefined && value !== '',
      ),
    );
    return this.studentService.update(studid, filteredData);
  }

  @Delete(':studid')
  async delete(@Param('studid') studid: number) {
    return this.studentService.delete(studid);
  }
}
