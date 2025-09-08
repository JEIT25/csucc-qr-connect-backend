import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, new RoleGuard('admin'))
@Controller('admins/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async all() {
    return this.studentService.find({});
  }

  @Get(':student_id')
  async get(@Param('student_id') student_id: number) {
    return this.studentService.findOneBy({ student_id });
  }

  @Post()
  async create(@Body() body: any) {
    return this.studentService.save(body);
  }

  @Patch(':student_id')
  async update(@Param('student_id') student_id: number, @Body() body: any) {
    return this.studentService.update(student_id, body);
  }

  @Delete(':student_id')
  async delete(@Param('student_id') student_id: number) {
    return this.studentService.delete(student_id);
  }
}
