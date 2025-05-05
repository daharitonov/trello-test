import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ColumnEntity } from 'src/columns/columns.entity';
import { Exclude } from 'class-transformer';

@Entity('cards')
export class CardsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => ColumnEntity, (column) => column.cards)
  @JoinColumn({ name: 'column_id' })
  column: ColumnEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
