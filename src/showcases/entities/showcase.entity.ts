import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {ShowcasePhoto} from "./showcase-photo.entity";

@Entity({ name: 'showcases'})
export class Showcase {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.showcases)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => ShowcasePhoto, (showcasePhoto) => showcasePhoto.showcase)
    photos: ShowcasePhoto[];

    @Column({length: 100})
    title: string;

    @Column({length: 100, nullable: true})
    subtitle: string;

    @Column({length: 200, nullable: true})
    url: string;

    @Column({length: 200, nullable: true})
    image: string;

    @Column({type: "int", default: 1})
    order: number;

    @Column({type: "text", nullable: true})
    description: string;

    @CreateDateColumn({name: 'created_at'})
    created_at: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updated_at: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deleted_at: Date;
}