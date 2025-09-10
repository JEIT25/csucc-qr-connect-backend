import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { MasterlistService } from './masterlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, new RoleGuard('instructor'))
@Controller('instructors/masterlists')
export class MasterlistController {
  constructor(private readonly masterlistService: MasterlistService) {}
  // POST /masterlists/:attendance_id
  @Post(':attendance_id')
  async create(@Param('attendance_id') attendance_id: number) {
    // create the masterlist and link it to the attendance
    return this.masterlistService.save({
      attendance: { attendance_id }, // <-- reference Attendance by ID
    });
  }
}
