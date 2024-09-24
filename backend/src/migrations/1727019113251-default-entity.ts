import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1727019113251 implements MigrationInterface {
    name = 'defaultEntity1727019113251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "configuration" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_03bad512915052d2342358f0d8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."metrics_soiltype_enum" AS ENUM('Latossolos', 'Argissolos', 'Neossolos')`);
        await queryRunner.query(`CREATE TABLE "metrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "minHumidity" numeric(5,2) NOT NULL, "maxHumidity" numeric(5,2) NOT NULL, "minTemperature" numeric(5,2) NOT NULL, "maxTemperature" numeric(5,2) NOT NULL, "season" numeric(5,2) NOT NULL, "soilType" "public"."metrics_soiltype_enum" NOT NULL DEFAULT 'Argissolos', CONSTRAINT "PK_5283cad666a83376e28a715bf0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "humidities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "humidity" numeric(5,2) NOT NULL, CONSTRAINT "PK_8490c61174c4e49004f75224a4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seasons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "season" numeric(5,2) NOT NULL, CONSTRAINT "PK_cb8ed53b5fe109dcd4a4449ec9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "temperatures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "temperature" numeric(5,2) NOT NULL, CONSTRAINT "PK_3b7ef82d874db2e87d572777846" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "soils" DROP COLUMN "minHumidity"`);
        await queryRunner.query(`ALTER TABLE "soils" DROP COLUMN "maxHumidity"`);
        await queryRunner.query(`ALTER TABLE "soils" DROP COLUMN "minTemperature"`);
        await queryRunner.query(`ALTER TABLE "soils" DROP COLUMN "maxTemperature"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soils" ADD "maxTemperature" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "soils" ADD "minTemperature" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "soils" ADD "maxHumidity" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "soils" ADD "minHumidity" numeric(5,2) NOT NULL`);
        await queryRunner.query(`DROP TABLE "temperatures"`);
        await queryRunner.query(`DROP TABLE "seasons"`);
        await queryRunner.query(`DROP TABLE "humidities"`);
        await queryRunner.query(`DROP TABLE "metrics"`);
        await queryRunner.query(`DROP TYPE "public"."metrics_soiltype_enum"`);
        await queryRunner.query(`DROP TABLE "configuration"`);
    }

}
