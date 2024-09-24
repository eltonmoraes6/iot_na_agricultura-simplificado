import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1727022366606 implements MigrationInterface {
    name = 'defaultEntity1727022366606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metrics" DROP COLUMN "season"`);
        await queryRunner.query(`CREATE TYPE "public"."metrics_season_enum" AS ENUM('Summer', 'Fall', 'Winter', 'Spring')`);
        await queryRunner.query(`ALTER TABLE "metrics" ADD "season" "public"."metrics_season_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metrics" ALTER COLUMN "soilType" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metrics" ALTER COLUMN "soilType" SET DEFAULT 'Argissolos'`);
        await queryRunner.query(`ALTER TABLE "metrics" DROP COLUMN "season"`);
        await queryRunner.query(`DROP TYPE "public"."metrics_season_enum"`);
        await queryRunner.query(`ALTER TABLE "metrics" ADD "season" numeric(5,2) NOT NULL`);
    }

}
