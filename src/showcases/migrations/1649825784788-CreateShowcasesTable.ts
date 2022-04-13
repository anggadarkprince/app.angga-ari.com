import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class CreateShowcasesTable1649825784788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'showcases',
            columns: [
                {name: 'id', type: 'int', unsigned: true, isPrimary: true, isGenerated: true, generationStrategy: "increment"},
                {name: 'user_id', type: 'int', unsigned: true},
                {name: 'title', type: 'varchar', length: '100'},
                {name: 'subtitle', type: 'varchar', length: '100', isNullable: true},
                {name: 'url', type: 'varchar', length: '100', isNullable: true},
                {name: 'image', type: 'varchar', length: '100', isNullable: true},
                {name: 'order', type: 'int', default: 1},
                {name: 'status', type: 'enum', enum: ['active', 'inactive'], default: "'active'"},
                {name: 'description', type: 'text', isNullable: true},
                {name: 'created_at', type: 'timestamp', default: 'now()'},
                {name: 'updated_at', type: 'timestamp', isNullable: true},
                {name: 'deleted_at', type: 'timestamp', isNullable: true},
            ]
        }), true);

        await queryRunner.createForeignKey(
            "showcases",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createIndex(
            "showcases",
            new TableIndex({
                name: "idx_showcase_title_content",
                columnNames: ["title", "subtitle"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("showcases", true);
    }

}
