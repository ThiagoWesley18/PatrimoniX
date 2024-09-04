-- CreateTable
CREATE TABLE `transaction` (
    `id` CHAR(40) NOT NULL,
    `tax` DECIMAL(10, 2) NOT NULL,
    `executionDate` DATETIME(3) NOT NULL,
    `transactionType` VARCHAR(191) NOT NULL,
    `totalValue` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `userCpf` CHAR(11) NOT NULL,
    `tradingCode` VARCHAR(6) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ativo` (
    `tradingCode` VARCHAR(6) NOT NULL,
    `nomeInstituicao` VARCHAR(40) NOT NULL,
    `cnpj` CHAR(14) NOT NULL,

    PRIMARY KEY (`tradingCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `cpf` CHAR(11) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `lastName` VARCHAR(20) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `phone` CHAR(11) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`cpf`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_userCpf_fkey` FOREIGN KEY (`userCpf`) REFERENCES `user`(`cpf`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_tradingCode_fkey` FOREIGN KEY (`tradingCode`) REFERENCES `ativo`(`tradingCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
