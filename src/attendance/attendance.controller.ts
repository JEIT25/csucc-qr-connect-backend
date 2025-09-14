import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { AttendanceService } from './attendance.service';

@Controller('instructors/attendances')
@UseGuards(AuthGuard, new RoleGuard('instructor'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
  @Get()
  async all(@Query('type') type: string, @Req() request: any) {
    const where: any = { user: { user_id: request.user.user_id } };
    if (type) where.type = type;

    return this.attendanceService.find({ where });
  }

  // GET /attendances/:attendance_id
  @Get(':attendance_id')
  async get(@Param('attendance_id') attendance_id: number, @Req() request: any) {
    const attendance = await this.attendanceService.findOne({
      where: { attendance_id },
      relations: ['user', 'masterlist'],
    });

    if (!attendance) throw new NotFoundException('Attendance not found');
    if (attendance.user.user_id !== request.user.user_id) {
      throw new ForbiddenException('You do not own this attendance');
    }

    return attendance;
  }

  // POST /attendances
  @Post()
  async create(@Body() body: any, @Req() request: any) {
    body.user = { user_id: request.user.user_id }; // set owner
    return this.attendanceService.save(body);
  }

  // PATCH /attendances/:attendance_id
  @Patch(':attendance_id')
  async update(
    @Param('attendance_id') attendance_id: number,
    @Body() body: any,
    @Req() request: any,
  ) {
    const attendance = await this.attendanceService.findOne({
      where: { attendance_id },
      relations: ['user', 'masterlist'],
    });

    if (!attendance) throw new NotFoundException('Attendance not found');
    if (attendance.user.user_id !== request.user.user_id) {
      throw new ForbiddenException('You cannot edit this attendance');
    }

    return this.attendanceService.update(attendance_id, body);
  }

  // DELETE /attendances/:attendance_id
  @Delete(':attendance_id')
  async delete(@Param('attendance_id') attendance_id: number, @Req() request: any) {
    const attendance = await this.attendanceService.findOne({
      where: { attendance_id },
      relations: ['user'],
    });

    if (!attendance) throw new NotFoundException('Attendance not found');
    if (attendance.user.user_id !== request.user.user_id) {
      throw new ForbiddenException('You cannot delete this attendance');
    }

    return this.attendanceService.delete(attendance_id);
  }
}
