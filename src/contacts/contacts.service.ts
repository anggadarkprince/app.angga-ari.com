import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Like, Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessage } from './dto/filter-message.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { MailService } from '../mail/mail.service';
import { ReplyMessageDto } from './dto/reply-message.dto';
import {
  STATUS_HOLD,
  STATUS_REJECTED,
  STATUS_REPLIED,
} from './constants/status';
import * as fs from 'fs';
import { stringify } from 'csv-stringify';
import { join } from 'path';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private repo: Repository<Contact>,
    private mailService: MailService,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    const contact = this.repo.create(createMessageDto);

    return this.repo.save(contact);
  }

  async findAll(filters: FilterMessage) {
    const queryBuilder = this.repo.createQueryBuilder('contacts');

    queryBuilder.orderBy(filters.order_by || 'id', filters.order_method);

    if (filters.page) {
      queryBuilder
        .skip(filters?.skip || (filters.page - 1) * filters.limit)
        .take(filters.limit);
    }

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

    if (!filters.page) {
      return await queryBuilder.getMany();
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

  async exportToCsv(filters: FilterMessage) {
    filters.page = null;
    const contacts = await this.findAll(filters);
    const path = join('uploads', 'temp', 'contacts.csv');
    if (contacts instanceof Array) {
      const writableStream = fs.createWriteStream(path);
      const stringifier = stringify({
        delimiter: ',',
        header: true,
        columns: [
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'project', header: 'Project' },
          { key: 'message', header: 'Message' },
          { key: 'status', header: 'Status' },
          { key: 'created_at', header: 'Created At' },
        ],
      });
      contacts.forEach((item) => {
        stringifier.write(item);
      });
      stringifier.pipe(writableStream);

      return path;
    }
    return null;
  }

  async findOne(id: number) {
    const contact = await this.repo.findOne({
      where: { id: id },
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

  async reply(id: number, replyMessage: ReplyMessageDto) {
    const contact = await this.findOne(id);

    const result = this.mailService.replyContactMessage(
      contact,
      replyMessage.subject,
      replyMessage.message,
    );

    if (result) {
      contact.status = STATUS_REPLIED;
      return this.repo.save(contact);
    }
    throw new BadRequestException('Reply email failed');
  }

  async reject(id: number) {
    const contact = await this.findOne(id);
    if (contact.status == STATUS_REPLIED) {
      throw new ConflictException('Cannot reject "REPLIED" message');
    }
    contact.status = STATUS_REJECTED;
    return this.repo.save(contact);
  }

  async hold(id: number) {
    const contact = await this.findOne(id);
    if (contact.status == STATUS_REPLIED) {
      throw new ConflictException('Cannot hold "REPLIED" message');
    }
    contact.status = STATUS_HOLD;
    return this.repo.save(contact);
  }
}
