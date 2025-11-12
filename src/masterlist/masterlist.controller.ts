import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { MasterlistService } from './masterlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { UploadMasterlistDto } from './dto/create-masterlist.dto';

@UseGuards(AuthGuard)
@Controller('masterlists')
export class MasterlistController {
  constructor(private readonly masterlistService: MasterlistService) {}

  /**
   * ADMIN - Uploads a new masterlist file.
   * Processes records and links them to instructors.
   */
  @UseGuards(new RoleGuard('admin'))
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadMasterlist(@Body() uploadDto: UploadMasterlistDto) {

    const { uploadedCount, skippedCount, failedInstructorCount, unuploadedRecords } =
      await this.masterlistService.processMasterlistUpload(uploadDto);

    // Build a detailed message based on the service response
    const messageParts = [];
    messageParts.push(`${uploadedCount} records uploaded successfully.`);

    if (skippedCount > 0) {
      messageParts.push(`${skippedCount} records were skipped (already exist).`);
    }

    if (failedInstructorCount > 0) {
      messageParts.push(`${failedInstructorCount} records failed (missing instructor info).`);
    }

    // Calculate other failures (e.g., DB errors) not related to instructor lookup
    const otherFailures = unuploadedRecords.length - failedInstructorCount;
    if (otherFailures > 0) {
      messageParts.push(`${otherFailures} records failed due to a database error.`);
    }

    const message = messageParts.join(' ');

    return {
      message,
      unuploadedRecords: unuploadedRecords,
    };
  }

  //ADMIN - View all masterlists (with instructor info)
  @UseGuards(AuthGuard)
  @UseGuards(new RoleGuard('admin'))
  @Get('all')
  async getAllMasterlistsForAdmin(
    @Query('sy') sy?: string,
    @Query('sem') sem?: string,
    @Query('subjcode') subjcode?: string,
    @Query('section') section?: string,
  ) {
    const masterlists = await this.masterlistService.findAllWithInstructors(
      sy,
      sem,
      subjcode,
      section,
    );
    return {
      message: 'All masterlists retrieved successfully',
      masterlists,
    };
  }

  // INSTRUCTOR - View assigned masterlists
  @UseGuards(AuthGuard)
  @UseGuards(new RoleGuard('instructor'))
  @Get('my-masterlists')
  async getInstructorMasterlists(@Req() req) {
    const emp = req.emp; // comes from AuthGuard payload

    const masterlists = await this.masterlistService.findByInstructor(emp.empid);

    return {
      message: 'Assigned masterlists retrieved successfully',
      masterlists,
    };
  }

  /**
   * ADMIN - Deletes all masterlist entries for a specific subject, SY, and Sem.
   * This will also cascade-delete all related attendee records.
   */
  @UseGuards(new RoleGuard('admin'))
  @Delete()
  @HttpCode(HttpStatus.OK) // Send 200 OK on success instead of 204
  async deleteMasterlistBySubject(
    @Query('sy') sy: string,
    @Query('sem') sem: string,
    @Query('subjcode') subjcode: string,
  ) {
    const affected = await this.masterlistService.deleteBySubject(sy, sem, subjcode);
    return {
      message: `Successfully deleted ${affected} masterlist records for ${subjcode}.`,
      affected,
    };
  }
}
