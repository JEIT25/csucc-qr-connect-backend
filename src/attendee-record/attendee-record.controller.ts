import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  Get, // [NEW] Import Get
  Query, // [NEW] Import Query
  BadRequestException, // [NEW] Import BadRequestException
} from '@nestjs/common';
import { AttendeeRecordService } from './attendee-record.service';
import { RecordAttendanceDto } from './dto/record-attendance.dto';

@Controller('instructors/attendee-records')
export class AttendeeRecordController {
  constructor(private readonly attendeeRecordService: AttendeeRecordService) {}

  /**
   * [NEW] Endpoint to get all attendee records for a specific subject
   * with filtering capabilities.
   */
  @Get('subject-records')
  async getRecordsForSubject(
    @Query('sy') sy: string,
    @Query('sem') sem: string,
    @Query('subjcode') subjcode: string,
    @Query('empid') empid: string,
    @Query('section') section?: string,
    @Query('search') search?: string,
  ) {
    if (!sy || !sem || !subjcode || !empid) {
      throw new BadRequestException('Missing required query parameters: sy, sem, subjcode, empid');
    }
    return this.attendeeRecordService.findAllBySubject({
      sy,
      sem,
      subjcode,
      empid,
      section,
      search,
    });
  }

  /**
   * Endpoint to record attendance from the QR scanner.
   */
  @Post('record')
  @HttpCode(200) // Return 200 OK on success, not 201 Created
  async recordAttendance(@Body(new ValidationPipe()) dto: RecordAttendanceDto) {
    return this.attendeeRecordService.recordAttendance(dto);
  }
}
