/*
  Warnings:

  - You are about to drop the column `event_data` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `event_type` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `page_url` on the `Analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "event_data",
DROP COLUMN "event_type",
DROP COLUMN "ip_address",
DROP COLUMN "page_url";
