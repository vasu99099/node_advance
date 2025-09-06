/*
  Warnings:

  - A unique constraint covering the columns `[sso_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `sso_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_sso_id_key` ON `users`(`sso_id`);
