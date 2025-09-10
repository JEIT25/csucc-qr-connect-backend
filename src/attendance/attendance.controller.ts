import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { AttendanceService } from './attendance.service';

@Controller('instructors/attendances')
@UseGuards(AuthGuard, new RoleGuard('instructor'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
  @Get()
  async all(@Req() request: any) {
    return this.attendanceService.find({
      //using the user_id from the request user attached by the authguard,
      //we get the owned attendance of the current user
      where: { user: { user_id: request.user.user_id } },
    });
  }

  @Get(':attendance_id')
  async get(@Param('attendance_id') attendance_id: number) {
    return this.attendanceService.findOne({
      where: { attendance_id: attendance_id },
      relations: ['masterlist'], //include masterlist
    });
  }

  @Post()
  async create(@Body() body: any, @Req() request: any) {
    body.user = { user_id: request.user.user_id }; //sets user_id foreign key to the current user
    return this.attendanceService.save(body);
  }

  @Patch(':attendance_id')
  async update(@Param('attendance_id') attendance_id: number, @Body() body: any) {
    return this.attendanceService.update(attendance_id, body);
  }

  @Delete(':attendance_id')
  async delete(@Param('attendance_id') attendance_id: number) {
    return this.attendanceService.delete(attendance_id);
  }
}
