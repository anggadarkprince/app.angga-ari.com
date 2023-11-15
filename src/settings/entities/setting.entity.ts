import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'settings' })
export class Setting {
  @PrimaryColumn('varchar')
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string;
}
