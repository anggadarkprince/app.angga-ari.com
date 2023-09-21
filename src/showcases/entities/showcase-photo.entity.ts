import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Showcase } from './showcase.entity';

@Entity({ name: 'showcase_photos' })
export class ShowcasePhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Showcase, (showcase) => showcase.photos)
  @JoinColumn({ name: 'showcase_id' })
  showcase: Showcase;

  @Column({ length: 100 })
  photo_title: string;

  @Column()
  src: string;

  @Column({ type: 'int', default: 1 })
  order: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
