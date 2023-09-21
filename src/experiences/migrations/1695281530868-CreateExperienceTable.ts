import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateExperienceTable1695281530868 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'experiences',
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
          {
            name: 'label',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          { name: 'title', type: 'varchar', length: '100' },
          { name: 'subtitle', type: 'varchar', length: '300' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'from', type: 'date' },
          { name: 'to', type: 'date', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'experiences',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'experiences',
      new TableIndex({
        name: 'idx_experience_title_content',
        columnNames: ['title', 'subtitle'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('experiences', true);
  }
}
