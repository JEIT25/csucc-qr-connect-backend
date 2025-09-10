import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { MasterlistMember } from '../masterlist-member/masterlist-member.entity';
import { Attendance } from 'src/attendance/attendance.entity';

@Entity('masterlists')
export class Masterlist {
  @PrimaryGeneratedColumn()
  masterlist_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => MasterlistMember, (member) => member.masterlist)
  members: MasterlistMember[];

  @OneToOne(() => Attendance, (attendance) => attendance.masterlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attendance_id' })
  attendance: Attendance;
}
