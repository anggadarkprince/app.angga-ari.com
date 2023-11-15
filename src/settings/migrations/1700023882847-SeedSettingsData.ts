import { MigrationInterface, QueryRunner } from 'typeorm';
import { Setting } from '../entities/setting.entity';

export class SeedSettingsData1700023882847 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .createQueryBuilder()
      .insert()
      .into(Setting)
      .values([
        { key: 'title', value: "Angga's Website" },
        { key: 'author', value: 'Angga Ari Wijaya' },
        { key: 'url', value: 'https://angga-ari.com' },
        {
          key: 'keywords',
          value:
            'angga, ari, wijaya, personal website, programmer, software engineer, developer, designer, web, android, ios, java, php, react',
        },
        { key: 'description', value: 'Angga Ari Wijaya personal website' },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    ['title', 'author', 'url', 'keywords', 'description'].forEach((key) => {
      queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(Setting)
        .where('key = :key', { key: key })
        .execute();
    });
  }
}
