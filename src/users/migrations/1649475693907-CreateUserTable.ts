import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateUserTable1649475693907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {name: 'id', type: 'int', isPrimary: true, unsigned: true, isGenerated: true, generationStrategy: "increment"},
                {name: 'name', type: 'varchar', length: '100'},
                {name: 'username', type: 'varchar', length: '50'},
                {name: 'email', type: 'varchar', length: '50'},
                {name: 'password', type: 'varchar', length: '200'},
                {name: 'avatar', type: 'varchar', length: '200', isNullable: true},
                {name: 'is_active', type: 'boolean', default: true},
                {name: 'created_at', type: 'timestamp', default: 'now()'},
                {name: 'updated_at', type: 'timestamp', isNullable: true},
            ]
        }), true);

        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "idx_user_email_name",
                columnNames: ["email", "username"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users", true);
    }

}
