import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterlistMember } from './masterlist-member.entity';
import { AbstractService } from '../shared/abstract.service';
import { StudentService } from 'src/student/student.service';
import { MasterlistService } from 'src/masterlist/masterlist.service';

@Injectable()
export class MasterlistMemberService extends AbstractService {
  constructor(
    @InjectRepository(MasterlistMember)
    private readonly memberRepository: Repository<MasterlistMember>,
    private readonly studentService: StudentService,
    private readonly masterlistService: MasterlistService,
  ) {
    super(memberRepository);
  }

  async createBulk(masterlist_id: number, members: any[]) {
    const masterlist = await this.masterlistService.findOneBy({ masterlist_id });
    if (!masterlist) {
      throw new NotFoundException(`Masterlist ${masterlist_id} not found`);
    }

    const savedMembers = [];
    const skipStudents: { studid: string; reason: string }[] = [];

    for (const memberData of members) {
      memberData.masterlist_id = masterlist_id;

      // Check if student exists in Students table
      const student = await this.studentService.findOneBy({ studid: memberData.studid });
      if (!student) {
        skipStudents.push({ studid: memberData.studid, reason: 'Student not found' });
        continue;
      }

      // Check if already exists in this masterlist
      const exist = await this.memberRepository.findOneBy({
        masterlist_id,
        studid: memberData.studid,
      });
      if (exist) {
        skipStudents.push({ studid: memberData.studid, reason: 'Already in masterlist' });
        continue;
      }

      const saved = await this.memberRepository.save(memberData);
      savedMembers.push(saved);
    }

    return {
      success: 'Bulk members processed.',
      uploadedCount: savedMembers.length,
      skippedCount: skipStudents.length,
    };
  }

  async createSingle(masterlist_id: number, memberData: any) {
    const masterlist = await this.masterlistService.findOneBy({ masterlist_id });
    if (!masterlist) {
      throw new NotFoundException(`Masterlist ${masterlist_id} not found`);
    }

    const student = await this.studentService.findOneBy({ studid: memberData.studid });
    if (!student) {
      return { skipStudents: [{ studid: memberData.studid, reason: 'Student not found' }] };
    }

    const exist = await this.memberRepository.findOneBy({
      masterlist_id,
      studid: memberData.studid,
    });
    if (exist) {
      return { skipStudents: [{ studid: memberData.studid, reason: 'Already in masterlist' }] };
    }

    memberData.masterlist_id = masterlist_id;
    const saved = await this.memberRepository.save(memberData);

    return {
      success: 'Member successfully created.',
      member: saved,
      uploadedCount: 1,
      skippedCount: 0,
    };
  }
}
