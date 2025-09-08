import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { MasterlistMember } from '../masterlist-member/masterlist-member.entity';

@Entity('masterlists')
export class Masterlist {
  @PrimaryGeneratedColumn()
  masterlist_id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  instructor_id: number;

  @Column({ nullable: true })
  attendance_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.masterlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  instructor: User;

  @OneToMany(() => MasterlistMember, (member) => member.masterlist)
  members: MasterlistMember[];
}
