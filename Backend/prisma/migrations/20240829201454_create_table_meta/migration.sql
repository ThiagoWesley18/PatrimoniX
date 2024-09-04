-- CreateTable
CREATE TABLE `meta` (
    `id` CHAR(40) NOT NULL,
    `nomeMeta` VARCHAR(40) NOT NULL,
    `dataMeta` VARCHAR(10) NOT NULL,
    `meta` DOUBLE NOT NULL,
    `userId` CHAR(11) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meta` ADD CONSTRAINT `meta_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`cpf`) ON DELETE RESTRICT ON UPDATE CASCADE;
