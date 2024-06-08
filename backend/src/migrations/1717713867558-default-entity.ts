import { MigrationInterface, QueryRunner } from "typeorm";

export class defaultEntity1717713867558 implements MigrationInterface {
    name = 'defaultEntity1717713867558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensors" DROP CONSTRAINT "FK_e59312cc84bff8de56a533663d1"`);
        await queryRunner.query(`ALTER TABLE "sensors" ADD CONSTRAINT "FK_e59312cc84bff8de56a533663d1" FOREIGN KEY ("soilId") REFERENCES "soils"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensors" DROP CONSTRAINT "FK_e59312cc84bff8de56a533663d1"`);
        await queryRunner.query(`ALTER TABLE "sensors" ADD CONSTRAINT "FK_e59312cc84bff8de56a533663d1" FOREIGN KEY ("soilId") REFERENCES "soils"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
