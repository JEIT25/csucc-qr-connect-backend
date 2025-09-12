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
import { ClassAttendance } from '../class-attendance/class-attendance.entity';

export enum AttendanceStatus {
  OPEN = 'open',
  CLOSE = 'close',
}

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  attendance_id: number;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.OPEN,
  })
  status: AttendanceStatus;

  @Column()
  location: string;

  @Column({ length: 9 })
  sy: string;

  @Column({ length: 3 })
  sem: string;

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

  // Attendance has one ClassAttendance
  @OneToOne(() => ClassAttendance, (classAttendance) => classAttendance.attendance, {
    cascade: true,
  })
  classAttendance: ClassAttendance;
}
