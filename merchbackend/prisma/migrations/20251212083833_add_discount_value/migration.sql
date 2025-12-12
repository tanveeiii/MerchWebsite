/*
  Warnings:

  - Added the required column `discount_value` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "discount_value" DECIMAL(65,30) NOT NULL;
