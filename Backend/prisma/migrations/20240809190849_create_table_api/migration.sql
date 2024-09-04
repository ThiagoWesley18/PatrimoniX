-- AlterTable
ALTER TABLE `ativo` ADD COLUMN `quote` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `quotes` (
    `id` VARCHAR(40) NOT NULL,
    `tradingCode` VARCHAR(40) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `quotes_tradingCode_key`(`tradingCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ativo` ADD CONSTRAINT `ativo_quote_fkey` FOREIGN KEY (`quote`) REFERENCES `quotes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
