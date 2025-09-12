import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';

@Entity('class_attendances')
export class ClassAttendance {
  // Subject Code as Primary Key
  @PrimaryColumn({ type: 'varchar', length: 30 })
  subjcode: string;

  @Column({ length: 2 })
  yrlvl: string;

  @Column({ length: 30 })
  section: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // RELATION: one ClassAttendance belongs to one Attendance
  @OneToOne(() => Attendance, (attendance) => attendance.classAttendance, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attendance_id' }) // FK in this table
  attendance: Attendance;
}
