import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// Import ILike for case-insensitive matching
import { Repository, ILike, FindOptionsWhere, Or, IsNull } from 'typeorm';
import { Masterlist } from './masterlist.entity';
import { Employee, EmpRole } from '../employee/employee.entity';
import { UploadMasterlistDto, CreateMasterlistDto } from './dto/create-masterlist.dto';
import { AbstractService } from 'src/shared/abstract.service';
import { EmployeeService } from 'src/employee/employee.service';
import e from 'express';

// Define the shape of the response for the upload process
interface UploadResult {
  uploadedCount: number;
  skippedCount: number; // Added to track existing records
  failedInstructorCount: number; // Added to track instructor lookup failures
  unuploadedRecords: CreateMasterlistDto[];
}

@Injectable()
export class MasterlistService extends AbstractService {
  private readonly logger = new Logger(MasterlistService.name);

  constructor(
    @InjectRepository(Masterlist)
    private readonly masterlistRepository: Repository<Masterlist>,
    private readonly employeeService: EmployeeService,
  ) {
    super(masterlistRepository);
  }

  /**
   * Helper function to convert strings to Title Case.
   */
  private toTitleCase(str: string): string {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Processes the uploaded masterlist records.
   * Tries to find a matching instructor for each record.
   * Creates masterlist entries for successful matches and tracks failures.
   */
  async processMasterlistUpload(uploadDto: UploadMasterlistDto): Promise<UploadResult> {
    const unuploadedRecords: CreateMasterlistDto[] = [];
    let uploadedCount = 0;
    let skippedCount = 0; // Track existing records
    let failedInstructorCount = 0; // Track records that failed instructor lookup
    this.logger.log(`[MasterlistUpload] Starting process for ${uploadDto.records.length} records.`);

    // Use a for...of loop to process records sequentially
    for (const record of uploadDto.records) {
      const {
        instructor_lastname,
        instructor_firstname,
        instructor_middlename,
        instructor_extname,
        ...masterlistData // Contains sy, sem, subjcode, section, stud...
      } = record;


      // 1. Trim whitespace from all lookup name fields
      const lastname = (instructor_lastname || '').trim();
      const firstname = (instructor_firstname || '').trim();
      const middlename = (instructor_middlename || '').trim();
      const extname = (instructor_extname || '').trim();

      let employee: Employee | null = null;
      try {
        // 2. Find an active employee who is an INSTRUCTOR and matches the name
        employee = await this.employeeService.findOne({
          where: {
            lastname: ILike(lastname),
            firstname: ILike(firstname),

            // If middlename is not empty, match it.
            // If it IS empty, match EITHER "" OR NULL.
            middlename: middlename ? ILike(middlename) : Or(ILike(''), IsNull()),

            // If extname is not empty, match it.
            // If it IS empty, match EITHER "" OR NULL.
            extname: extname ? ILike(extname) : Or(ILike(''), IsNull()),

            role: EmpRole.INSTRUCTOR,
            isactive: true,
          },
        });
      } catch (error) {
        this.logger.error('[MasterlistUpload] Error finding employee:', error, record);
        unuploadedRecords.push(record);
        failedInstructorCount++; // Increment instructor failure count
        continue; // Skip to the next record
      }

      if (employee) {
        // 3. Found a matching instructor, prepare data
        const formattedData = {
          sy: masterlistData.SY,
          sem: masterlistData.SEM,
          studid: masterlistData.studid,
          studlastname: this.toTitleCase(masterlistData.studlastname),
          studfirstname: this.toTitleCase(masterlistData.studfirstname),
          studmiddlename: this.toTitleCase(masterlistData.studmiddlename || ''),
          studextname: this.toTitleCase(masterlistData.studextname || ''),
          studmajor: this.toTitleCase(masterlistData.studmajor),
          studlevel: masterlistData.studlevel,
          department: this.toTitleCase(masterlistData.department),
          college: this.toTitleCase(masterlistData.college),
          subjcode: (masterlistData.subjcode || '').toUpperCase(),
          section: (masterlistData.section || '').toUpperCase(),
          employee: employee,
        };

        try {
          // 4. Check if this exact entry already exists
          const existingEntry = await this.masterlistRepository.findOne({
            where: {
              studid: formattedData.studid,
              subjcode: formattedData.subjcode,
              sy: formattedData.sy,
              sem: formattedData.sem,
              department: formattedData.department,
              college: formattedData.college,
            },
          });

          if (existingEntry) {
            // 5a. Record already exists, skip it.
            skippedCount++;
            this.logger.warn(
              `[MasterlistUpload] Skipping existing record: studid ${formattedData.studid} in subjcode ${formattedData.subjcode}`,
            );
          } else {
            // 5b. Record is new, save it.
            const newMasterlistEntry = this.masterlistRepository.create(formattedData);
            await this.masterlistRepository.save(newMasterlistEntry);
            uploadedCount++;
          }
        } catch (dbError) {
          this.logger.error(
            '[MasterlistUpload] Error checking/saving masterlist entry:',
            dbError.message,
            record,
          );
          unuploadedRecords.push(record); // Add to unuploaded, but it's a DB error, not instructor lookup
        }
      } else {
        // 6. No matching instructor found
        this.logger.warn(
          `record: ${middlename}`,
          `[MasterlistUpload] No matching instructor found for:`,
          // Log the specific values you searched for:
          `LName: '${lastname}', FName: '${firstname}', MName: '${middlename}', EName: '${extname}'`,
        );
        unuploadedRecords.push(record);
        failedInstructorCount++; // Increment instructor failure count
      }
    }

    this.logger.log(
      `[MasterlistUpload] Process complete. Successful: ${uploadedCount}, Skipped: ${skippedCount}, Failed (Total): ${unuploadedRecords.length} (of which ${failedInstructorCount} were instructor lookup failures)`,
    );
    return { uploadedCount, skippedCount, failedInstructorCount, unuploadedRecords };
  }

  // 1.For Admin - Get all masterlists including assigned instructor
  async findAllWithInstructors(sy?: string, sem?: string, subjcode?: string, section?: string) {
    // Build a dynamic query to avoid issues with null/undefined filters
    const where: FindOptionsWhere<Masterlist> = {};
    if (sy) where.sy = sy;
    if (sem) where.sem = sem;
    if (subjcode) where.subjcode = subjcode;
    if (section) where.section = section;

    return this.masterlistRepository.find({
      where: where,
      relations: ['employee'],
      order: { sy: 'DESC', sem: 'DESC' },
    });
  }

  // 2.For Instructor - Get only the instructor's assigned masterlists
  async findByInstructor(empid: number) {
    // Fix: Query by the 'employee' relation and 'empid' sub-property
    return this.masterlistRepository.find({
      where: { employee: { empid: empid } },
      relations: ['employee'],
      order: { sy: 'DESC', sem: 'DESC' },
    });
  }

  /**
   *Deletes all masterlist records (and associated attendee records via cascade)
   * that match a specific subject, school year, and semester.
   * @returns The number of masterlist records deleted.
   */
  async deleteBySubject(sy: string, sem: string, subjcode: string): Promise<number> {
    // 1. Validate input
    if (!sy || !sem || !subjcode) {
      throw new BadRequestException(
        'Missing required parameters: sy, sem, and subjcode are all required.',
      );
    }
    this.logger.log(
      `[Delete] Request to delete masterlist for: ${subjcode}, SY: ${sy}, Sem: ${sem}`,
    );

    try {
      // 2. Perform the delete operation
      // This assumes your AttendeeRecord entity has { onDelete: 'CASCADE' }
      // on its ManyToOne relationship with the Masterlist entity.
      const result = await this.masterlistRepository.delete({
        sy: sy,
        sem: sem,
        subjcode: subjcode,
      }); // 3. Log and return the result

      if (result.affected === 0) {
        this.logger.warn(
          `[Delete] No masterlist records found to delete for: ${subjcode}, SY: ${sy}, Sem: ${sem}`,
        );
      } else {
        this.logger.log(
          `[Delete] Successfully deleted ${result.affected} records for: ${subjcode}, SY: ${sy}, Sem: ${sem}`,
        );
      }
      return result.affected || 0;
    } catch (error) {
      this.logger.error(
        `[Delete] Failed to delete masterlist for: ${subjcode}, SY: ${sy}, Sem: ${sem}`,
        error.stack,
      ); // Re-throw the error to be caught by the controller's exception filter
      throw error;
    }
  }
}
