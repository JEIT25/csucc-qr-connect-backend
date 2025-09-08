import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Masterlist } from '../masterlist/masterlist.entity';

@Entity('masterlist_members')
export class MasterlistMember {
  @PrimaryGeneratedColumn()
  masterlist_member_id: number;

  @Column()
  masterlist_id: number;

  @Column()
  student_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Masterlist, (masterlist) => masterlist.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'masterlist_id' })
  masterlist: Masterlist;

  @ManyToOne(() => Student, (student) => student.masterlist_members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
