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
import { ColumnEntity } from 'src/columns/columns.entity';
import { CommentsEntity } from 'src/comments/comments.entity';
import { Exclude } from 'class-transformer';

@Entity('cards')
export class CardsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => ColumnEntity, (column) => column.cards)
  @JoinColumn({ name: 'column_id' })
  @Exclude()
  column: ColumnEntity;

  @OneToMany(() => CommentsEntity, (comment) => comment.card)
  comments: CommentsEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
