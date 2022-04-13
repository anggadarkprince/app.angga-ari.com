import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Showcase} from "./entities/showcase.entity";
import {Repository} from "typeorm";
import {CreateShowcaseDto} from "./dto/create-showcase.dto";
import {User} from "../users/entities/user.entity";
import {UpdateShowcaseDto} from "./dto/update-showcase.dto";

@Injectable()
export class ShowcasesService {
    constructor(@InjectRepository(Showcase) private repo: Repository<Showcase>) {
    }

    /**
     * Create new showcase.
     *
     * @param createShowcaseDto
     * @param user
     */
    async create(createShowcaseDto: CreateShowcaseDto, user: User) {
        const showcase = this.repo.create(createShowcaseDto);
        showcase.user = user;

        return this.repo.save(user);
    }

    /**
     * Find all showcase data.
     */
    findAll() {
        return this.repo.find();
    }

    /**
     * Find single showcase.
     *
     * @param id
     */
    findOne(id: number) {
        return this.repo.findOne(id);
    }

    /**
     * Update showcase data.
     *
     * @param id
     * @param updateShowcaseDto
     */
    async update(id: number, updateShowcaseDto: UpdateShowcaseDto) {
        const showcase = await this.findOne(id);
        if (!showcase) {
            throw new NotFoundException('Showcase not found');
        }
        Object.assign(showcase, updateShowcaseDto);

        return this.repo.save(showcase);
    }

    /**
     * Delete showcase data.
     *
     * @param id
     */
    async remove(id: number) {
        const showcase = await this.findOne(id);
        if (!showcase) {
            throw new NotFoundException('Showcase not found');
        }

        return this.repo.remove(showcase);
    }
}
