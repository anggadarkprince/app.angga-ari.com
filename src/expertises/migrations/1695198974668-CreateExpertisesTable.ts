import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateExpertisesTable1695198974668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'expertises',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            unsigned: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'user_id', type: 'int', unsigned: true },
          { name: 'section_id', type: 'int', unsigned: true, isNullable: true },
          { name: 'title', type: 'varchar', length: '50', isNullable: true },
          {
            name: 'subtitle',
            type: 'varchar',
            length: '300',
            isNullable: true,
          },
          { name: 'level', type: 'smallint', unsigned: true, default: 1 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'expertises',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'expertises',
      new TableForeignKey({
        columnNames: ['section_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'expertises',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'expertises',
      new TableIndex({
        name: 'idx_expertise_title_content',
        columnNames: ['title', 'subtitle'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('showcases', true);
  }
}
