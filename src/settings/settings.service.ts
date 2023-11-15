import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { SettingDto } from './dto/setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private repo: Repository<Setting>,
    private connection: DataSource,
  ) {}

  async findAll() {
    const settings = await this.repo.find();
    return settings.reduce((carry, item) => {
      carry[item.key] = item.value;
      return carry;
    }, {});
  }

  async findOne(key: string, defaultValue = null) {
    const settings = await this.findAll();
    return settings[key] || defaultValue;
  }

  async update(settingDto: SettingDto) {
    return this.connection.transaction(async (manager) => {
      for (const key in settingDto) {
        await manager
          .createQueryBuilder()
          .update(Setting)
          .set({ value: settingDto[key] })
          .where('key = :key', { key: key })
          .execute();
      }
      return this.findAll();
    });
  }
}
