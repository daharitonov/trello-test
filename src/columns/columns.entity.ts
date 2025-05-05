import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { CardsEntity } from 'src/cards/cards.entity';
import { Exclude } from 'class-transformer';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.columns)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: User;

  @OneToMany(() => CardsEntity, (card) => card.column)
  cards: CardsEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
