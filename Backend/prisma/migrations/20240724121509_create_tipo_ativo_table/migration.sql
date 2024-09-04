-- AlterTable
ALTER TABLE `ativo` ADD COLUMN `tipo` INTEGER NULL;

-- CreateTable
CREATE TABLE `tipo_ativo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(20) NOT NULL DEFAULT 'acao',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ativo` ADD CONSTRAINT `ativo_tipo_fkey` FOREIGN KEY (`tipo`) REFERENCES `tipo_ativo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
