import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountType } from './types/account.type';
import { UserAccount } from './user-account.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column()
  type: AccountType;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  monthlyPaymentAmount: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 1,
  })
  maxUsers: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  moonclerkPlanId: string;

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @OneToMany(type => UserAccount, userAccount => userAccount.account, {onDelete: 'CASCADE'})
  userAccounts: UserAccount[];
}
