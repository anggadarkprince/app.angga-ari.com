import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpertiseDto } from './dto/create-expertise.dto';
import { UpdateExpertiseDto } from './dto/update-expertise.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expertise } from './entities/expertise.entity';
import { User } from '../users/entities/user.entity';
import { FilterExpertise } from './dto/filter-expertise.dto';

@Injectable()
export class ExpertisesService {
  constructor(
    @InjectRepository(Expertise) private repo: Repository<Expertise>,
  ) {}

  async create(createExpertiseDto: CreateExpertiseDto, user: User) {
    if (createExpertiseDto.section_id) {
      const section = await this.findOne(createExpertiseDto.section_id);
      if (section.section_id) {
        throw new BadRequestException('Expertise should reference a section');
      }
    }

    const expertise = this.repo.create(createExpertiseDto);
    expertise.user_id = user.id;

    return this.repo.save(expertise);
  }

  findAll(filter: FilterExpertise) {
    if (filter.group) {
      const where: { id?: number; section_id?: number } = {};
      if (filter.section_id) {
        where.id = filter.section_id;
      } else {
        where.section_id = null;
      }
      return this.repo.find({
        where: where,
        relations: ['skills'],
      });
    }
    return this.repo.find({
      where: {
        ...(filter.section_id && {
          section_id: filter.section_id,
        }),
      },
    });
  }

  async findOne(id: number) {
    const expertise = await this.repo.findOne({
      where: { id: +id },
      relations: ['skills'],
    });
    if (!expertise) {
      throw new NotFoundException('Expertise not found');
    }

    return expertise;
  }

  async update(id: number, updateExpertiseDto: UpdateExpertiseDto) {
    const expertise = await this.findOne(id);
    Object.assign(expertise, updateExpertiseDto);
    console.log(updateExpertiseDto)

    return this.repo.save(expertise);
  }

  async remove(id: number) {
    const expertise = await this.findOne(id);

    return this.repo.remove(expertise);
  }
}
