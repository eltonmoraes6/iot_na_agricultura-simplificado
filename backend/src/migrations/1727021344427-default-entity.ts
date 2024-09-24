import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1727021344427 implements MigrationInterface {
    name = 'defaultEntity1727021344427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seasons" DROP COLUMN "season"`);
        await queryRunner.query(`CREATE TYPE "public"."seasons_season_enum" AS ENUM('Summer', 'Fall', 'Winter', 'Spring')`);
        await queryRunner.query(`ALTER TABLE "seasons" ADD "season" "public"."seasons_season_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seasons" DROP COLUMN "season"`);
        await queryRunner.query(`DROP TYPE "public"."seasons_season_enum"`);
        await queryRunner.query(`ALTER TABLE "seasons" ADD "season" character varying NOT NULL`);
    }

}
