import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractService } from 'src/shared/abstract.service';
import { AttendeeRecord } from './attendee-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AttendeeRecordService extends AbstractService {
  constructor(
    @InjectRepository(AttendeeRecord)
    private readonly attendeeRecordRepository: Repository<AttendeeRecord>,
  ) {
    super(attendeeRecordRepository);
  }

  // async getAttendeeRecords(attendance_id: number) {
  //   const foundAttendance = await this.attendanceService.findOneBy({ attendance_id });

  //   if (!foundAttendance) {
  //     throw new NotFoundException(`Attendance with attendance id ${attendance_id} not found`);
  //   }

  //   const attendeeRecords = await this.attendeeRecordRepository.find({
  //     where: { attendance: { attendance_id: foundAttendance.attendance_id } },
  //     relations: ['attendance', 'masterlistMember', 'masterlistMember.student'],
  //   });

  //   return {
  //     success: 'Attendee Record successfully fetched.',
  //     attendeeRecords,
  //   };
  // }

  // async recordAttendance(masterlist_id: number, studid: string, mode: 'check_in' | 'check_out') {
  //   // 1. Get masterlist with its members + student relations
  //   const masterlist = await this.masterlistService.findOneWithMembers(masterlist_id);

  //   if (!masterlist) {
  //     throw new NotFoundException(`Masterlist with id ${masterlist_id} not found`);
  //   }

  //   // 2. Find the member with the given studid
  //   const foundMember = masterlist.masterlist_members.find(
  //     (member) => member.student.studid === studid,
  //   );

  //   if (!foundMember) {
  //     throw new BadRequestException(`Student with ID ${studid} not found in this masterlist`);
  //   }

  //   // 3. Check if an attendee record already exists for this member
  //   let attendee = await this.attendeeRecordRepository.findOne({
  //     where: { masterlistMember: { masterlist_member_id: foundMember.masterlist_member_id } },
  //     relations: ['masterlistMember', 'attendance'],
  //   });

  //   // 4. If no record exists, create one
  //   if (!attendee) {
  //     attendee = this.attendeeRecordRepository.create({
  //       masterlistMember: foundMember,
  //       attendance: masterlist.attendance,
  //       [mode]: new Date(),
  //     });
  //   } else {
  //     // 5. If record exists, check if the field is already set
  //     if (attendee[mode]) {
  //       throw new BadRequestException(
  //         `Student ${foundMember.student.lastname},
  //         ${foundMember.student.firstname},
  //         ${foundMember.student.middlename} -
  //         ${foundMember.studid} has already ${mode.replace('_', ' ')}`,
  //       );
  //     }
  //     attendee[mode] = new Date();
  //   }

  //   // 6. Save the record
  //   const savedRecord = await this.attendeeRecordRepository.save(attendee);

  //   return {
  //     message: `Student ${studid} successfully recorded for ${mode.replace('_', ' ')}`,
  //     member: foundMember,
  //     timestamp: attendee[mode],
  //     status: true,
  //     attendee_record: savedRecord,
  //   };
  // }
}
