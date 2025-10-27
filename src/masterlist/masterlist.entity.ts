import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employee/employee.entity'; // FK: EMP_ID
import { AttendeeRecord } from 'src/attendee-record/attendee-record.entity';

@Entity('masterlists')
export class Masterlist {
  @PrimaryGeneratedColumn({ name: 'masterlist_id' })
  masterlist_id: number;

  @Column({ name: 'empid' })
  empid: number;

  @Column({ name: 'sy', type: 'varchar', length: 20, nullable: true })
  sy: string; // school year

  @Column({ name: 'sem', type: 'varchar', length: 20, nullable: true })
  sem: string; // semester

  @Column({ name: 'subjcode', type: 'varchar', length: 50, nullable: true })
  subjcode: string;

  @Column({ name: 'section', type: 'varchar', length: 50, nullable: true })
  section: string;

  @Column({ name: 'studid', type: 'varchar', length: 50 })
  studid: string;

  @Column({ name: 'stud_lastname', type: 'varchar', length: 100 })
  stud_lastname: string;

  @Column({ name: 'stud_firstname', type: 'varchar', length: 100 })
  stud_firstname: string;

  @Column({ name: 'stud_middlename', type: 'varchar', length: 100, nullable: true })
  stud_middlename: string;

  @Column({ name: 'stud_extname', type: 'varchar', length: 20, nullable: true })
  stud_extname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empid' })
  employee: Employee;

  @OneToMany(() => AttendeeRecord, (attendeeRecord) => attendeeRecord.masterlist)
  attendeeRecords: AttendeeRecord[];
}
