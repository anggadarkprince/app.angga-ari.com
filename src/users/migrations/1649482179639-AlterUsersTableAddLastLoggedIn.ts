import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterUsersTableAddLastLoggedIn1649482179639 implements MigrationInterface {
    name = 'AlterUsersTableAddLastLoggedIn1649482179639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'last_logged_in', type: 'datetime', isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'last_logged_in');
    }

}
