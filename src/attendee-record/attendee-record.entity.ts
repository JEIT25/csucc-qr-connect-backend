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
import { Attendance } from '../attendance/attendance.entity';
import { MasterlistMember } from '../masterlist-member/masterlist-member.entity';

@Entity('attendee_record')
export class AttendeeRecord {
  @PrimaryGeneratedColumn({ name: 'attendee_record_id' })
  attendeeRecordId: number;
  @JoinColumn({ name: 'masterlist_member_id' })
  member: MasterlistMember;

  @Column({ name: 'check_in', type: 'timestamp', nullable: true })
  check_in: Date;

  @Column({ name: 'check_out', type: 'timestamp', nullable: true })
  check_out: Date;

  @Column({ name: 'loc_latitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  locLatitude: number;

  @Column({ name: 'loc_longitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  locLongitude: number;

  @Column({ name: 'device_fingerprint', type: 'varchar', length: 255, nullable: true })
  deviceFingerprint: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //  Many-to-One with Attendance
  @ManyToOne(() => Attendance, (attendance) => attendance.attendeeRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attendance_id' })
  attendance: Attendance;

  // One-to-One with MasterListMember (owner side)
  @OneToOne(() => MasterlistMember, (member) => member.attendeeRecord, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'masterlist_member_id' }) // FK lives here
  masterlistMember: MasterlistMember;
}
