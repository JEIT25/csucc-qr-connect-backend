/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.STUDENT,
  })
  type: UserType;

  @Column({ name: 'lname', length: 100 })
  lname: string;

  @Column({ name: 'fname', length: 100 })
  fname: string;

  @Column({ name: 'middle_initial', length: 1, nullable: true })
  middleInitial?: string;

  @Column({ name: 'extension', length: 5, nullable: true })
  extension?: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'acc_status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  accStatus: AccountStatus;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
