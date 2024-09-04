-- CreateTable
CREATE TABLE `pergunta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `criterio` VARCHAR(100) NOT NULL,
    `texto` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resposta_ativo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ativoCodigo` VARCHAR(40) NOT NULL,
    `perguntaId` INTEGER NOT NULL,
    `resposta` BOOLEAN NOT NULL,

    UNIQUE INDEX `resposta_ativo_ativoCodigo_perguntaId_key`(`ativoCodigo`, `perguntaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `resposta_ativo` ADD CONSTRAINT `resposta_ativo_ativoCodigo_fkey` FOREIGN KEY (`ativoCodigo`) REFERENCES `ativo`(`tradingCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resposta_ativo` ADD CONSTRAINT `resposta_ativo_perguntaId_fkey` FOREIGN KEY (`perguntaId`) REFERENCES `pergunta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
