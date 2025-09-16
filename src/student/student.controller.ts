import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  Put,
  ConflictException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { CreateStudentDto } from './dto/create-student-dto';
import { UpdateStudentDto } from './dto/update-student-dto';

@Controller('admins/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(AuthGuard)
  @Get()
  async all() {
    return this.studentService.find({});
  }
  @UseGuards(AuthGuard, new RoleGuard('admin'))
  @Get(':studid')
  async get(@Param('studid') studid: number) {
    return this.studentService.findOneBy({ studid });
  }

  @UseGuards(AuthGuard, new RoleGuard('admin'))
  @Post()
  async create(@Body() body: CreateStudentDto & { students?: CreateStudentDto[] }) {
    // If the request contains a bulk array
    if (body.students && Array.isArray(body.students)) {
      const savedStudents = [];
      const skippedStudents = [];

      for (const studentData of body.students) {
        const existStudent = await this.studentService.findOneBy({ studid: studentData.studid });

        if (existStudent) {
          skippedStudents.push({
            studid: studentData.studid,
            reason: 'Student ID already exists',
          });
          continue; // skip saving
        }

        const saved = await this.studentService.save(studentData);
        savedStudents.push(saved);
      }

      return {
        success: 'Bulk students processed.',
        createdCount: savedStudents.length,
        skippedCount: skippedStudents.length,
        created: savedStudents,
        skipped: skippedStudents,
      };
    }

    // --- Single student creation ---
    const existStudent = await this.studentService.findOneBy({ studid: body.studid });
    if (existStudent) {
      throw new ConflictException('Student ID already exists');
    }

    // Filter out empty/null/undefined values
    const filteredData = Object.fromEntries(
      Object.entries(body).filter(
        ([_, value]) => value !== null && value !== undefined && value !== '',
      ),
    );

    return {
      success: 'Student successfully created.',
      student: await this.studentService.save(filteredData),
    };
  }

  @UseGuards(AuthGuard, new RoleGuard('admin'))
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

  @UseGuards(AuthGuard, new RoleGuard('admin'))
  @Delete(':studid')
  async delete(@Param('studid') studid: number) {
    return this.studentService.delete(studid);
  }
}
