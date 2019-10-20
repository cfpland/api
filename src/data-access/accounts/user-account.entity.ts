import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AccountRoleType } from './types/account-role.type';
import { Account } from './account.entity';

@Entity({ name: 'user_account' })
export class UserAccount {
  @Column({
    default: 'owner',
    nullable: false,
  })
  role: AccountRoleType;

  @ManyToOne(type => User, user => user.userAccounts, {primary: true})
  user: User;

  @ManyToOne(type => Account, account => account.userAccounts, {primary: true})
  account: Account;
}
