import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum EmpRole {
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  empid: number; // auto-generated primary key

  @Column({
    type: 'enum',
    enum: EmpRole,
    default: EmpRole.INSTRUCTOR,
  })
  role: EmpRole;

  @Column({ type: 'varchar', length: 100 })
  lastname: string;

  @Column({ type: 'varchar', length: 100 })
  firstname: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  middlename: string;

  @Column({ type: 'varchar', length: 5, default: '' })
  extname: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  email: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  password: string;

  @Column({ type: 'boolean', default: true })
  isactive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
