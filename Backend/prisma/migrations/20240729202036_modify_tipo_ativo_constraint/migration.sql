/*
  Warnings:

  - The primary key for the `ativo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[tipo]` on the table `tipo_ativo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ativo` DROP FOREIGN KEY `ativo_tipo_fkey`;

-- AlterTable
ALTER TABLE `ativo` DROP PRIMARY KEY,
    MODIFY `tradingCode` VARCHAR(40) NOT NULL,
    MODIFY `tipo` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`tradingCode`);

-- AlterTable
ALTER TABLE `tipo_ativo` ALTER COLUMN `tipo` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `tipo_ativo_tipo_key` ON `tipo_ativo`(`tipo`);

-- AddForeignKey
ALTER TABLE `ativo` ADD CONSTRAINT `ativo_tipo_fkey` FOREIGN KEY (`tipo`) REFERENCES `tipo_ativo`(`tipo`) ON DELETE SET NULL ON UPDATE CASCADE;
