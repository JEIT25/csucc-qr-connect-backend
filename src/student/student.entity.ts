import { Attendance } from 'src/attendance/attendance.entity';
import { MasterlistMember } from 'src/masterlist-member/masterlist-member.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

export enum StudMajor {
  BSEE = 'BSEE',
  BSIT = 'BSINFOTECH',
  EET = 'EET',
  BSCpE = 'BSCpE',
}

export enum StudLevel {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
}

@Entity('students')
export class Student {
  // Use string for student ID (manual input)
  @PrimaryColumn({ length: 15 })
  studid: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50, default: '' })
  middlename?: string;

  @Column({ length: 10, default: ' ' })
  extname: string;

  @Column({
    type: 'enum',
    enum: StudMajor,
  })
  studmajor: StudMajor;

  @Column({
    type: 'enum',
    enum: StudLevel,
  })
  studlevel: StudLevel;

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
