import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusAndRenameTimestamps1709913600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add status column with default value true
        await queryRunner.query(`
            ALTER TABLE "license" 
            ADD COLUMN IF NOT EXISTS "status" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove status column
        await queryRunner.query(`
            ALTER TABLE "license" 
            DROP COLUMN IF EXISTS "status"
        `);
    }
}
