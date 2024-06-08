import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1717712092103 implements MigrationInterface {
    name = 'defaultEntity1717712092103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."soils_soiltype_enum" AS ENUM('Latossolos', 'Argissolos', 'Neossolos')`);
        await queryRunner.query(`CREATE TABLE "soils" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "soilType" "public"."soils_soiltype_enum" NOT NULL DEFAULT 'Argissolos', "minHumidity" numeric(5,2) NOT NULL, "maxHumidity" numeric(5,2) NOT NULL, "minTemperature" numeric(5,2) NOT NULL, "maxTemperature" numeric(5,2) NOT NULL, CONSTRAINT "PK_08c79e6c2e5e049845e61a6521b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sensors" ADD "soilId" uuid`);
        await queryRunner.query(`ALTER TABLE "sensors" ADD CONSTRAINT "FK_e59312cc84bff8de56a533663d1" FOREIGN KEY ("soilId") REFERENCES "soils"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensors" DROP CONSTRAINT "FK_e59312cc84bff8de56a533663d1"`);
        await queryRunner.query(`ALTER TABLE "sensors" DROP COLUMN "soilId"`);
        await queryRunner.query(`DROP TABLE "soils"`);
        await queryRunner.query(`DROP TYPE "public"."soils_soiltype_enum"`);
    }

}
