import {
  BeforeInsert,
  Column,
  Entity, JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TrackingStatus } from './types/tracking-status.type';
import { AbstractEntity } from '../abstracts/abstract.entity';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class TrackedConference {
  @Column()
  @PrimaryColumn()
  atConferenceId: string;

  @Column()
  status: TrackingStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @ManyToOne(type => User, user => user.trackedConferences, { primary: true })
  user: User;

  @ManyToMany(type => AbstractEntity, abstractEntity => abstractEntity.trackedConferences)
  @JoinTable({name: 'tracked_conference_abstract'})
  abstracts: AbstractEntity[];
}
