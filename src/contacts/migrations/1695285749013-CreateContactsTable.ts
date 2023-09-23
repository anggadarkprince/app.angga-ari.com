import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateContactsTable1695285749013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contacts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            unsigned: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '100', isNullable: true },
          { name: 'project', type: 'varchar', length: '100', isNullable: true },
          { name: 'message', type: 'text' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', isNullable: true },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndex(
      'contacts',
      new TableIndex({
        name: 'idx_contact_name_email',
        columnNames: ['name', 'email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contacts', true);
  }
}
