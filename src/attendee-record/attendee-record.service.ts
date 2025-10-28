import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractService } from 'src/shared/abstract.service';
import { AttendeeRecord } from './attendee-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
// [MODIFIED] Removed IsNull as it's no longer needed in this logic
import { Between, Brackets, Repository } from 'typeorm';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { MasterlistService } from 'src/masterlist/masterlist.service';

interface FindBySubjectQuery {
  sy: string;
  sem: string;
  subjcode: string;
  empid: string;
  section?: string;
  search?: string;
}

@Injectable()
export class AttendeeRecordService extends AbstractService {
  constructor(
    @InjectRepository(AttendeeRecord)
    private readonly attendeeRecordRepository: Repository<AttendeeRecord>,
    private readonly masterlistService: MasterlistService,
  ) {
    super(attendeeRecordRepository);
  }

  /**
   * Finds all attendee records for a specific subject,
   * joining masterlist data for filtering.
   */
  async findAllBySubject(query: FindBySubjectQuery) {
    // ... (This method remains unchanged)
    const { sy, sem, subjcode, empid, section, search } = query;

    const qb = this.attendeeRecordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.masterlist', 'masterlist')
      .where('masterlist.sy = :sy', { sy })
      .andWhere('masterlist.sem = :sem', { sem })
      .andWhere('masterlist.subjcode = :subjcode', { subjcode })
      .andWhere('masterlist.empid = :empid', { empid })
      .orderBy('record.check_in', 'DESC');

    if (section && section !== 'all') {
      qb.andWhere('masterlist.section = :section', { section });
    }

    if (search) {
      qb.andWhere(
        new Brackets((sqb) => {
          sqb
            .where('masterlist.studid ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('masterlist.stud_lastname ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('masterlist.stud_firstname ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    const records = await qb.getMany();
    return records;
  }

  /**
   * Records a check-in or check-out based on the scanned QR data.
   */
  async recordAttendance(dto: RecordAttendanceDto) {
    const { sy, sem, subjcode, empid, studid, recordType, type } = dto;

    // 1. Find the student in the masterlist
    const masterlistEntry = await this.masterlistService.findOneBy({
      sy,
      sem,
      subjcode,
      empid,
      studid,
    });

    if (!masterlistEntry) {
      throw new NotFoundException(`Student (${studid}) not found in this masterlist.`);
    }

    const studentName = `${studid} - ${masterlistEntry.stud_lastname}, ${masterlistEntry.stud_firstname}`;
    const masterlist_id = masterlistEntry.masterlist_id;

    // 2. Define "today" for date-based queries
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // 3. Find *any* record for this student/type with activity *today*
    //    (either a check-in OR a check-out)
    const todaysRecordOfType = await this.attendeeRecordRepository.findOne({
      where: [
        // Option 1: Record was checked IN today
        {
          masterlist_id,
          type: type,
          check_in: Between(startOfDay, endOfDay),
        },
        // Option 2: Record was checked OUT today
        {
          masterlist_id,
          type: type,
          check_out: Between(startOfDay, endOfDay),
        },
      ],
    });

    // 4. Handle Check-in Logic
    if (recordType === 'check-in') {
      if (todaysRecordOfType) {
        // A record for today already exists.
        // Check if it *already* has a check-in time.
        if (todaysRecordOfType.check_in) {
          throw new BadRequestException(`${studentName} has already checked in for ${type} today.`);
        }

        //  Record exists (from a check-out) but has no check-in. Update it.
        todaysRecordOfType.check_in = new Date();
        await this.attendeeRecordRepository.save(todaysRecordOfType);
        return { message: `Checked In (${type}): ${studentName}` };
      } else {
        // No record exists for today. Create a new one.
        const newRecord = this.attendeeRecordRepository.create({
          masterlist_id,
          type,
          check_in: new Date(),
          check_out: null, // Explicitly set check_out to null
        });
        await this.attendeeRecordRepository.save(newRecord);
        return { message: `Checked In (${type}): ${studentName}` };
      }
    }

    // 5. Handle Check-out Logic
    if (recordType === 'check-out') {
      if (todaysRecordOfType) {
        // A record for today already exists.
        // Check if it *already* has a check-out time.
        if (todaysRecordOfType.check_out) {
          throw new BadRequestException(
            `${studentName} has already checked out for ${type} today.`,
          );
        }

        // Record exists (from a check-in) but has no check-out. Update it.
        // This was the original "success" path for check-out.
        todaysRecordOfType.check_out = new Date();
        await this.attendeeRecordRepository.save(todaysRecordOfType);
        return { message: `Checked Out (${type}): ${studentName}` };
      } else {
        //  No record exists for today. Create a new one with only check-out.
        // This fulfills the requirement to check-out without a check-in.
        const newRecord = this.attendeeRecordRepository.create({
          masterlist_id,
          type,
          check_in: null, // Explicitly set check_in to null
          check_out: new Date(),
        });
        await this.attendeeRecordRepository.save(newRecord);
        return { message: `Checked Out (${type}): ${studentName}` };
      }
    }

    // Fallback in case recordType is invalid
    throw new BadRequestException('Invalid recordType specified.');
  }
}
