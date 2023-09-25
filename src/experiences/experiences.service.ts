import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience) private repo: Repository<Experience>,
  ) {}

  create(createExperienceDto: CreateExperienceDto, user: User) {
    const experience = this.repo.create(createExperienceDto);
    experience.user_id = user.id;

    return this.repo.save(experience);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const experience = await this.repo.findOne({
      where: { id: +id },
    });
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return experience;
  }

  async update(id: number, updateExperienceDto: UpdateExperienceDto) {
    const experience = await this.findOne(id);
    Object.assign(experience, updateExperienceDto);

    return this.repo.save(experience);
  }

  async remove(id: number) {
    const experience = await this.findOne(id);

    return this.repo.remove(experience);
  }
}
