-- CreateTable
CREATE TABLE `changelog` (
    `id` INTEGER NOT NULL,
    `sprint_name` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `change` (
    `id` CHAR(40) NOT NULL,
    `message` VARCHAR(200) NOT NULL,
    `changelogId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `change` ADD CONSTRAINT `change_changelogId_fkey` FOREIGN KEY (`changelogId`) REFERENCES `changelog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
