import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Showcase } from './entities/showcase.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { User } from '../users/entities/user.entity';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { ShowcasePhoto } from './entities/showcase-photo.entity';

@Injectable()
export class ShowcasesService {
  constructor(
    @InjectRepository(Showcase)
    private showcaseRepository: Repository<Showcase>,
    @InjectRepository(ShowcasePhoto)
    private showcasePhotoRepository: Repository<ShowcasePhoto>,
    private connection: DataSource,
  ) {}

  /**
   * Create new showcase.
   *
   * @param createShowcaseDto
   * @param user
   */
  async create(createShowcaseDto: CreateShowcaseDto, user: User) {
    return await this.connection.transaction(async (manager) => {
      let showcase = this.showcaseRepository.create(createShowcaseDto);
      showcase.user = user;
      showcase = await manager.save(showcase);

      for (const photo of createShowcaseDto.photos) {
        const showcasePhoto = this.showcasePhotoRepository.create(photo);
        showcasePhoto.showcase = showcase;
        await manager.save(showcasePhoto);
      }

      return showcase;
    });
  }

  /**
   * Find all showcase data.
   */
  findAll() {
    return this.showcaseRepository.find();
  }

  /**
   * Find single showcase.
   *
   * @param id
   */
  async findOne(id: number) {
    const showcase = await this.showcaseRepository.findOneBy({ id });
    if (!showcase) {
      throw new NotFoundException('Showcase not found');
    }
    return showcase;
  }

  /**
   * Update showcase data.
   *
   * @param id
   * @param updateShowcaseDto
   */
  async update(id: number, updateShowcaseDto: UpdateShowcaseDto) {
    const oldShowcase = await this.findOne(id);

    const { photos, ...showcaseData } = updateShowcaseDto;
    Object.assign(oldShowcase, showcaseData);

    return await this.connection.transaction(async (manager) => {
      const showcase = await manager.save(oldShowcase);

      await manager.delete(ShowcasePhoto, { showcase: showcase });
      for (const photo of photos) {
        const showcasePhoto = this.showcasePhotoRepository.create(photo);
        showcasePhoto.showcase = showcase;
        await manager.save(showcasePhoto);
      }

      return showcase;
    });
  }

  /**
   * Delete showcase data.
   *
   * @param id
   */
  async remove(id: number) {
    const showcase = await this.findOne(id);

    return this.showcaseRepository.softRemove(showcase);
  }
}
