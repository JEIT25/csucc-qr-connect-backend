import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Masterlist } from '../masterlist/masterlist.entity';

export enum AttendanceType {
  EVENT = 'event',
  CLASS_ATTENDANCE = 'class_attendance',
}

export enum AttendanceStatus {
  OPEN = 'open',
  CLOSE = 'close',
}

export enum Program {
  BSIT = 'BSIT',
  BSEE = 'BSEE',
  EET = 'EET',
  BSCPE = 'BSCpE',
}

export enum YearLevel {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
}

export enum Semester {
  FIRST = '1st',
  SECOND = '2nd',
}

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  attendance_id: number;

  @Column({
    type: 'enum',
    enum: AttendanceType,
  })
  type: AttendanceType;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.OPEN,
  })
  status: AttendanceStatus;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: Program,
  })
  program: Program;

  @Column({
    type: 'enum',
    enum: YearLevel,
  })
  year_level: YearLevel;

  @Column()
  subject: string;

  @Column()
  subject_code: string;

  @Column()
  school_year: string;

  @Column({
    type: 'enum',
    enum: Semester,
  })
  semester: Semester;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // RELATIONS
  // Attendance belongs to one User (user)
  @ManyToOne(() => User, (user) => user.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // foreign key in attendance table
  user: User;

  // Attendance has one Masterlist
  @OneToOne(() => Masterlist, (masterlist) => masterlist.attendance, { cascade: true })
  masterlist: Masterlist;
}
