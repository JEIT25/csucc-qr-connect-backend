import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { AbstractService } from 'src/shared/abstract.service';

@Injectable()
export class AttendanceService extends AbstractService {
  constructor(
    @InjectRepository(Attendance) private readonly attendanceRepository: Repository<Attendance>,
  ) {
    super(attendanceRepository);
  }
}
