import { MigrationInterface, QueryRunner } from "typeorm"

export class RenameUrlToDomain1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('license', 'url', 'domain');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('license', 'domain', 'url');
    }
}
