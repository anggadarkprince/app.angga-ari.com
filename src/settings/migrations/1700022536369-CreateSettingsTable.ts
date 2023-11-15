import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSettingsTable1700022536369 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'settings',
        columns: [
          {
            name: 'key',
            type: 'varchar',
            length: '100',
            isPrimary: true,
          },
          {
            name: 'value',
            type: 'text',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', isNullable: true },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('settings', true);
  }
}
