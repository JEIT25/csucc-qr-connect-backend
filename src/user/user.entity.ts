import { Exclude } from 'class-transformer';
import { Attendance } from 'src/attendance/attendance.entity';
import { Masterlist } from 'src/masterlist/masterlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.INSTRUCTOR,
  })
  role: UserRole;

  @Column({
    name: 'acc_status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  acc_status: AccountStatus;

  @Column({ name: 'lname', length: 100 })
  lname: string;

  @Column({ name: 'fname', length: 100 })
  fname: string;

  @Column({ name: 'middle_initial', length: 1, nullable: true })
  middle_initial?: string;

  @Column({ name: 'extension', length: 5, nullable: true })
  extension?: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  //an instructor can create many attendance
  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}
