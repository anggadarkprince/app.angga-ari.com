import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AlterContactsTableAddStatus1695604906902
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        default: "'PENDING'",
        length: '50',
      }),
    );

    await queryRunner.createIndex(
      'contacts',
      new TableIndex({
        name: 'idx_contact_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('contacts', 'status');
  }
}
