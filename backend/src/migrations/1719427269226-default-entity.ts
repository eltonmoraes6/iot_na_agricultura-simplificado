import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1719427269226 implements MigrationInterface {
    name = 'defaultEntity1719427269226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sensors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "temperature" numeric(5,2) NOT NULL, "humidity" numeric(5,2) NOT NULL, "season" character varying NOT NULL, "soilId" uuid, CONSTRAINT "PK_b8bd5fcfd700e39e96bcd9ba6b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."soils_soiltype_enum" AS ENUM('Latossolos', 'Argissolos', 'Neossolos')`);
        await queryRunner.query(`CREATE TABLE "soils" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "soilType" "public"."soils_soiltype_enum" NOT NULL DEFAULT 'Argissolos', "minHumidity" numeric(5,2) NOT NULL, "maxHumidity" numeric(5,2) NOT NULL, "minTemperature" numeric(5,2) NOT NULL, "maxTemperature" numeric(5,2) NOT NULL, CONSTRAINT "PK_08c79e6c2e5e049845e61a6521b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "weather" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "lat" double precision NOT NULL, "lon" double precision NOT NULL, "temp" double precision NOT NULL, "description" character varying NOT NULL, "humidity" double precision NOT NULL, "pressure" double precision NOT NULL, "wind_speed" double precision NOT NULL, "name" character varying NOT NULL, "feels_like" double precision NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_af9937471586e6798a5e4865f2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sensors" ADD CONSTRAINT "FK_e59312cc84bff8de56a533663d1" FOREIGN KEY ("soilId") REFERENCES "soils"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensors" DROP CONSTRAINT "FK_e59312cc84bff8de56a533663d1"`);
        await queryRunner.query(`DROP TABLE "weather"`);
        await queryRunner.query(`DROP TABLE "soils"`);
        await queryRunner.query(`DROP TYPE "public"."soils_soiltype_enum"`);
        await queryRunner.query(`DROP TABLE "sensors"`);
    }

}
