import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'expertises' })
export class Expertise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Expertise, (expertise) => expertise.skills)
  @JoinColumn({ name: 'section_id' })
  section: Expertise;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true })
  section_id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 300 })
  subtitle: string;

  @Column({ length: 100 })
  icon: string;

  @Column({ type: 'int', width: 5 })
  level: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Expertise, (expertise) => expertise.section)
  skills: Expertise[];
}
