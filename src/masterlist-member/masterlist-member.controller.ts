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
    @Body() body: any & { members?: any[] }, // can be a single member or a bulk array
  ) {
    // Bulk creation
    if (body.members && Array.isArray(body.members)) {
      const savedMembers = [];
      for (const memberData of body.members) {
        memberData.masterlist_id = masterlist_id;

        // Check if student already exists in this masterlist
        const exist = await this.masterlistMemberService.findOneBy({
          masterlist_id,
          studid: memberData.studid,
        });
        if (exist)
          throw new ConflictException(
            `Student ${memberData.studid} already exists in this masterlist`,
          );

        const saved = await this.masterlistMemberService.save(memberData);
        savedMembers.push(saved);
      }
      return { success: 'Bulk members successfully created.', members: savedMembers };
    }

    // Single creation
    body.masterlist_id = masterlist_id;
    const exist = await this.masterlistMemberService.findOneBy({
      masterlist_id,
      studid: body.studid,
    });
    if (exist) throw new ConflictException('Student already exists in this masterlist');

    const member = await this.masterlistMemberService.save(body);
    return { success: 'Member successfully created.', member };
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
