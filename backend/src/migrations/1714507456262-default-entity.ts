import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1714507456262 implements MigrationInterface {
    name = 'defaultEntity1714507456262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sensors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "temperature" numeric(5,2) NOT NULL, "humidity" numeric(5,2) NOT NULL, "season" character varying NOT NULL, CONSTRAINT "PK_b8bd5fcfd700e39e96bcd9ba6b7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sensors"`);
    }

}
