import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MasterlistService } from './masterlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, new RoleGuard('instructor'))
@Controller('instructors/masterlists')
export class MasterlistController {
  constructor(private readonly masterlistService: MasterlistService) {}
  @Get()
  async all() {
    return this.masterlistService.find({});
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.masterlistService.findOneBy({ student_id: id });
  }

  @Post()
  async create(@Body() body: any) {
    return this.masterlistService.save(body);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.masterlistService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.masterlistService.delete(id);
  }
}
