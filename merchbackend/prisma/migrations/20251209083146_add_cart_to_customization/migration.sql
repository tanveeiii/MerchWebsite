/*
  Warnings:

  - A unique constraint covering the columns `[cart_id]` on the table `Customization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Customization" DROP CONSTRAINT "Customization_order_item_id_fkey";

-- AlterTable
ALTER TABLE "Customization" ADD COLUMN     "cart_id" INTEGER,
ALTER COLUMN "order_item_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customization_cart_id_key" ON "Customization"("cart_id");

-- AddForeignKey
ALTER TABLE "Customization" ADD CONSTRAINT "Customization_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "OrderItem"("order_item_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customization" ADD CONSTRAINT "Customization_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("cart_id") ON DELETE SET NULL ON UPDATE CASCADE;
