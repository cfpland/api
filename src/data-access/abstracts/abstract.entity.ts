import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity({ name: 'abstract' })
export class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  other: string;

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    nullable: false,
  })
  userId: string;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @ManyToOne(type => User, user => user.abstracts)
  user: User;
}
