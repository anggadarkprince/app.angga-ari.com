import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProfileTable1695952852964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
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
            name: 'full_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'tagline',
            type: 'varchar',
            length: '300',
            isNullable: true,
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'experience_years',
            type: 'int',
            default: 0,
          },
          {
            name: 'completed_projects',
            type: 'int',
            default: 0,
          },
          {
            name: 'learning_hours',
            type: 'int',
            default: 0,
          },
          {
            name: 'email_address',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('profiles', true);
  }
}
