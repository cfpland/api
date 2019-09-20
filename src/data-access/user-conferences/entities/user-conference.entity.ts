import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserConference {
  @Column()
  @PrimaryColumn()
  atConferenceId: string;

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @ManyToOne(type => User, user => user.savedConferences, { primary: true })
  user: User;
}
