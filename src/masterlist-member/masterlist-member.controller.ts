import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':studid')
  async get(@Param('studid') studid: number) {
    return this.masterlistMemberService.findOneBy({ studid });
  }

  // **Create individual or bulk members for a specific masterlist**
  @Post('masterlist/:masterlist_id')
  async create(
    @Param('masterlist_id') masterlist_id: number,
    @Body() body: any & { members?: any[] },
  ) {
    if (body.members && Array.isArray(body.members)) {
      return this.masterlistMemberService.createBulk(masterlist_id, body.members);
    }

    return this.masterlistMemberService.createSingle(masterlist_id, body);
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
