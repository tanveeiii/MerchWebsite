/*
  Warnings:

  - You are about to drop the column `razorpay_order_od` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "razorpay_order_od",
ADD COLUMN     "razorpay_order_id" TEXT,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "shipping_cost" SET DEFAULT 0,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
