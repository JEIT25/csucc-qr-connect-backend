import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MasterlistService } from './masterlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard)
@Controller('masterlists')
export class MasterlistController {
  constructor(private readonly masterlistService: MasterlistService) {}
  // POST /masterlists/:attendance_id
  // @Post(':empid')
  // async create(@Param('empid') empid: number) {
  // gets all assigned masterlists for this instructor
  //   return {
  //     masterlist: await this.masterlistService.save({
  //       attendance: { empid },
  //     }),
  //   };
  // }

  //ADMIN - View all masterlists (with instructor info)
  @UseGuards(new RoleGuard('admin'))
  @Get('all')
  async getAllMasterlistsForAdmin(
    @Query('sy') sy?: string,
    @Query('sem') sem?: string,
    @Query('subjcode') subjcode?: string,
    @Query('section') section?: string,
  ) {
    const masterlists = await this.masterlistService.findAllWithInstructors(
      sy,
      sem,
      subjcode,
      section,
    );
    return {
      message: 'All masterlists retrieved successfully',
      masterlists,
    };
  }

  // INSTRUCTOR - View assigned masterlists
  @UseGuards(new RoleGuard('instructor'))
  @Get('my-masterlists')
  async getInstructorMasterlists(@Req() req) {
    const emp = req.emp; // comes from AuthGuard payload

    const masterlists = await this.masterlistService.findByInstructor(emp.empid);

    return {
      message: 'Assigned masterlists retrieved successfully',
      masterlists,
    };
  }
}
