import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1727020631059 implements MigrationInterface {
    name = 'defaultEntity1727020631059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seasons" DROP COLUMN "season"`);
        await queryRunner.query(`ALTER TABLE "seasons" ADD "season" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seasons" DROP COLUMN "season"`);
        await queryRunner.query(`ALTER TABLE "seasons" ADD "season" numeric(5,2) NOT NULL`);
    }

}
