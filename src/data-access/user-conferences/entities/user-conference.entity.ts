import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserConferenceAction } from '../types/user-conference-action.type';
import { UserConferenceMetaDto } from '../validation/user-conference-meta.dto';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserConference {
  @Column()
  @PrimaryColumn()
  atConferenceId: string;

  @Column()
  @PrimaryColumn()
  action: UserConferenceAction;

  @Column({
    type: 'json',
    nullable: true,
  })
  meta: UserConferenceMetaDto;

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @ManyToOne(type => User, user => user.userConferences, { primary: true })
  user: User;
}
