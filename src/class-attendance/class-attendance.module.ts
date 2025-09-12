import { Module } from '@nestjs/common';
import { ClassAttendanceController } from './class-attendance.controller';
import { ClassAttendanceService } from './class-attendance.service';

@Module({
  controllers: [ClassAttendanceController],
  providers: [ClassAttendanceService]
})
export class ClassAttendanceModule {}
