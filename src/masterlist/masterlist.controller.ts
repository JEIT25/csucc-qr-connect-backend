import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
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
    return {
      message: 'Successfully created masterlist!',
      masterlist: await this.masterlistService.save({
        attendance: { attendance_id }, //reference Attendance by attendance_id
      }),
    };
  }

  // GET /masterlists/:masterlist_id
  @Get(':masterlist_id')
  async getMasterlistWithMembers(@Param('masterlist_id') masterlist_id: number) {
    const masterlist = await this.masterlistService.findOneWithMembers(masterlist_id);

    if (!masterlist) {
      return { message: 'Masterlist not found' };
    }

    return {
      message: 'Masterlist retrieved successfully',
      masterlist,
    };
  }

  //delete masterlist route
  @Delete(':masterlist_id')
  async delete(@Param('masterlist_id') masterlist_idid: number) {
    await this.masterlistService.delete(masterlist_idid);
    return {
      message: 'Delete Masterlist Successfully.',
    };
  }
}
