import { Masterlist } from 'src/masterlist/masterlist.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

// Define the enum for the type
export enum AttendanceType {
  CLASS = 'class-attendance',
  CONSULTATION = 'consultation',
}

@Entity('attendee_records')
export class AttendeeRecord {
  @PrimaryGeneratedColumn({ name: 'attendee_record_id' })
  attendeeRecordId: number;

  @Column({ name: 'masterlist_id' })
  masterlist_id: number;

  @Column({ name: 'type', type: 'varchar', length: 40, nullable: false })
  type: string;

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

  @ManyToOne(() => Masterlist, (masterlist) => masterlist.attendeeRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'masterlist_id' })
  masterlist: Masterlist;
}
