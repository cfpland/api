import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SavedConference } from '../../saved-conferences/entities/saved-conference.entity';
import { Search } from '../../searches/entities/search.entity';
import * as md5 from 'md5';
import { UserCommunicationPreferencesDto } from '../validation/user-communication-preferences.dto';
import { AbstractEntity } from '../../abstracts/abstract.entity';
import { TrackedConference } from '../../tracked-conferences/tracked-conference.entity';
import { UserAccount } from '../../accounts/user-account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  auth0UserId: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  twitter: string;

  @Column({
    nullable: true,
  })
  website: string;

  @Column({
    nullable: true,
  })
  speakingGoal: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  communicationPreferences: UserCommunicationPreferencesDto;

  @Column({
    nullable: true,
  })
  accountLevel: string;

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @BeforeUpdate()
  setUpdatedAt(): void {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  setCreatedAndUpdatedAt(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @OneToMany(type => SavedConference, userConference => userConference.user)
  savedConferences: SavedConference[];

  @OneToMany(type => TrackedConference, trackedConference => trackedConference.user)
  trackedConferences: TrackedConference[];

  @OneToMany(type => Search, search => search.user)
  searches: Search[];

  @OneToMany(type => AbstractEntity, abstractEntity => abstractEntity.user)
  abstracts: AbstractEntity[];

  @OneToMany(type => UserAccount, userAccount => userAccount.user)
  userAccounts: UserAccount[];

  protected profileUrl: string;

  @AfterLoad()
  getUrl() {
    const emailHash = md5(this.email);
    this.profileUrl = `https://www.gravatar.com/avatar/${emailHash}?d=retro`;
  }
}
