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

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 50, nullable: true })
  title: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ length: 300, nullable: true })
  tagline: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'int', default: 0 })
  experience_years: number;

  @Column({ type: 'int', default: 0 })
  completed_projects: number;

  @Column({ type: 'int', default: 0 })
  learning_hours: number;

  @Column({ length: 100, nullable: true })
  email_address: string;

  @Column({ length: 100, nullable: true })
  website: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
