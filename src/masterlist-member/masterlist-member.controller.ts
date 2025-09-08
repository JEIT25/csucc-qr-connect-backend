import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MasterlistMemberService } from './masterlist-member.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, new RoleGuard('instructor'))
@Controller('instructors/masterlist-members')
export class MasterlistMemberController {
  constructor(private readonly masterlistMemberService: MasterlistMemberService) {}
  @Get()
  async all() {
    return this.masterlistMemberService.find({});
  }

  @Get(':student_id')
  async get(@Param('student_id') student_id: number) {
    return this.masterlistMemberService.findOneBy({ student_id });
  }

  @Post()
  async create(@Body() body: any) {
    return this.masterlistMemberService.save(body);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.masterlistMemberService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.masterlistMemberService.delete(id);
  }
}
