import { Module } from '@nestjs/common';
import { AttendeeRecordService } from './attendee-record.service';
import { AttendeeRecordController } from './attendee-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeRecord } from './attendee-record.entity';
import { MasterlistModule } from 'src/masterlist/masterlist.module';

@Module({
  providers: [AttendeeRecordService],
  controllers: [AttendeeRecordController],
  imports: [TypeOrmModule.forFeature([AttendeeRecord]), MasterlistModule],
})
export class AttendeeRecordModule {}
