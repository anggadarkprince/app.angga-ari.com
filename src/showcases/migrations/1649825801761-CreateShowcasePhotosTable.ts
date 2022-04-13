import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class CreateShowcasePhotosTable1649825801761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'showcase_photos',
            columns: [
                {name: 'id', type: 'int', unsigned: true, isPrimary: true, isGenerated: true, generationStrategy: "increment"},
                {name: 'showcase_id', type: 'int', unsigned: true},
                {name: 'photo_title', type: 'varchar', length: '100'},
                {name: 'src', type: 'varchar', length: '250', isNullable: true},
                {name: 'order', type: 'int', default: 1},
                {name: 'created_at', type: 'timestamp', default: 'now()'},
            ]
        }), true);

        await queryRunner.createForeignKey(
            "showcase_photos",
            new TableForeignKey({
                columnNames: ["showcase_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "showcases",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createIndex(
            "showcase_photos",
            new TableIndex({
                name: "idx_showcase_photo_title",
                columnNames: ["photo_title"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("showcase_photos", true);
    }

}
