import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1727288364138 implements MigrationInterface {
    name = 'defaultEntity1727288364138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "water_flow_indicators" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "waterFlowRate" double precision NOT NULL, "totalWaterUsed" double precision NOT NULL, "isIrrigated" boolean NOT NULL DEFAULT false, "startIrrigationTime" TIMESTAMP, "stopIrrigationTime" TIMESTAMP, CONSTRAINT "PK_47076ea696f1eb2ec0f5c6aa845" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "water_flow_indicators"`);
    }

}
