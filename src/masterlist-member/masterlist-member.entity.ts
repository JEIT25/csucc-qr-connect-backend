import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Masterlist } from '../masterlist/masterlist.entity';
import { AttendeeRecord } from 'src/attendee-record/attendee-record.entity';

@Entity('masterlist_members')
export class MasterlistMember {
  @PrimaryGeneratedColumn()
  masterlist_member_id: number;

  @Column()
  masterlist_id: number;

  @Column()
  studid: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Masterlist, (masterlist) => masterlist.masterlist_members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'masterlist_id' })
  masterlist: Masterlist;

  @ManyToOne(() => Student, (student) => student.masterlist_members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studid' })
  student: Student;

  // One-to-One with AttendeeRecord (inverse side)
  @OneToOne(() => AttendeeRecord, (record) => record.masterlistMember)
  attendeeRecord: AttendeeRecord;
}
