import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CardsEntity } from 'src/cards/cards.entity';
import { Exclude } from 'class-transformer';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @ManyToOne(() => CardsEntity, (card) => card.comments)
  @JoinColumn({ name: 'card_id' })
  @Exclude()
  card: CardsEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
