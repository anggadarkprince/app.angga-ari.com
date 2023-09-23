import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Like, Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessage } from './dto/filter-message.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class ContactsService {
  constructor(@InjectRepository(Contact) private repo: Repository<Contact>) {}

  create(createMessageDto: CreateMessageDto) {
    const contact = this.repo.create(createMessageDto);

    return this.repo.save(contact);
  }

  async findAll(filters: FilterMessage) {
    const queryBuilder = this.repo.createQueryBuilder('contacts');

    queryBuilder
      .orderBy(filters.order_by || 'id', filters.order_method)
      .skip(filters.skip || (filters.page - 1) * filters.limit)
      .take(filters.limit);

    if (filters.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          const search = filters.search.trim();
          qb.where([
            { name: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
            { project: Like(`%${search}%`) },
            { message: Like(`%${search}%`) },
          ]);
        }),
      );
    }

    if (filters.project) {
      queryBuilder.andWhere('contacts.project = :project', {
        project: filters.project,
      });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      page: filters.page,
      limit: filters.limit,
      total: itemCount,
    });

    return new PageDto(entities, pageMetaDto);
  }
  async findOne(id: number) {
    const contact = await this.repo.findOne({
      where: { id: +id },
    });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async remove(id: number) {
    const contact = await this.findOne(id);

    return this.repo.remove(contact);
  }
}
