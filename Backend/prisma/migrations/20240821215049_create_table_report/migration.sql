-- CreateTable
CREATE TABLE `report` (
    `id` CHAR(40) NOT NULL,
    `titulo` VARCHAR(40) NOT NULL,
    `localizacao` VARCHAR(30) NULL,
    `conteudo` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tipo` VARCHAR(10) NOT NULL,
    `userCpf` CHAR(11) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_userCpf_fkey` FOREIGN KEY (`userCpf`) REFERENCES `user`(`cpf`) ON DELETE RESTRICT ON UPDATE CASCADE;
