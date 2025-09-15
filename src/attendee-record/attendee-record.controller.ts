import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AttendeeRecordService } from './attendee-record.service';

@Controller('instructors/attendee-records')
export class AttendeeRecordController {
  constructor(private readonly attendeeRecordService: AttendeeRecordService) {}

  @Post('record-attendee')
  async recordAttendance(@Body() body: any) {
    const result = await this.attendeeRecordService.recordAttendance(
      body.masterlist_id,
      body.studid,
      body.mode,
    );

    return result;
  }
}
