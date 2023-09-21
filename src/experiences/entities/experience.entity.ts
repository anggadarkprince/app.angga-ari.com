import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'experiences' })
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ length: 50 })
  label: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 300 })
  subtitle: string;

  @Column({ type: 'date' })
  from: string;

  @Column({ type: 'date', nullable: true })
  to: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
