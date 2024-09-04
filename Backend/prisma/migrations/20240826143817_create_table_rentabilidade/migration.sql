-- CreateTable
CREATE TABLE `rentabilidade` (
    `id` CHAR(40) NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `carteira` DOUBLE NOT NULL,
    `cdi` DOUBLE NOT NULL,
    `ibovespa` DOUBLE NOT NULL,
    `userCpf` CHAR(11) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rentabilidade` ADD CONSTRAINT `rentabilidade_userCpf_fkey` FOREIGN KEY (`userCpf`) REFERENCES `user`(`cpf`) ON DELETE RESTRICT ON UPDATE CASCADE;
