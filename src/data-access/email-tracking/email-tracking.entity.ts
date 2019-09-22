import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailTrackingBody } from './interfaces/email-tracking-body.interface';

@Entity()
export class EmailTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  timestamp: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  event: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  category: string[];

  @Column({
    type: 'varchar',
    nullable: true,
  })
  url: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  payload: EmailTrackingBody;
}
