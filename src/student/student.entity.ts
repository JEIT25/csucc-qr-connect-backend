import { Attendance } from 'src/attendance/attendance.entity';
import { MasterlistMember } from 'src/masterlist-member/masterlist-member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  student_id: number;

  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 100 })
  program: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => MasterlistMember, (member) => member.student)
  masterlist_members: MasterlistMember[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}
