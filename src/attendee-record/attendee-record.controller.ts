import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AttendeeRecordService } from './attendee-record.service';

@Controller('instructors/attendee-records')
export class AttendeeRecordController {
  constructor(private readonly attendeeRecordService: AttendeeRecordService) {}

  @Get(':attendance_id')
  async getAttendeeRecords(@Param('attendance_id') attendance_id: number) {
    return this.attendeeRecordService.getAttendeeRecords(attendance_id);
  }

  @Post('record-attendee')
  async recordAttendance(@Body() body: any) {
    const result = await this.attendeeRecordService.recordAttendance(
      body.masterlist_id,
      body.studid,
      body.mode,
    );

    return result;
  }

  @Delete(':attendee_record_id')
  async deleteRecord(@Param('attendee_record_id') attendee_record_id: number) {
    const result = await this.attendeeRecordService.delete(attendee_record_id);

    return {
      message: 'Successfully delete record',
      result,
    };
  }
}
