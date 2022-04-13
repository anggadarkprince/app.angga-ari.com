import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Showcase} from "../../showcases/entities/showcase.entity";

@Entity({ name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    name: string;

    @Column({length: 50})
    username: string;

    @Column({length: 50})
    email: string;

    @Column({length: 200})
    password: string;

    @Column({name: 'is_active', default: true})
    isActive: boolean;

    @CreateDateColumn({name: 'created_at'})
    created_at: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updated_at: Date;

    @OneToMany(() => Showcase, (showcase) => showcase.user)
    showcases: Showcase[];
}
