import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SearchOptionsDto } from '../validation/search-options.dto';

@Entity()
export class Search {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  options: SearchOptionsDto;

  @Column({
    type: 'timestamptz',
  })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = new Date();
  }

  @ManyToOne(type => User, user => user.searches)
  user: User;
}
