/*
  Warnings:

  - You are about to drop the column `ticket_id` on the `Complaint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "ticket_id";

-- CreateTable
CREATE TABLE "Customization" (
    "customization_id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "front_image_url" TEXT,
    "back_image_url" TEXT,
    "custom_text" TEXT,
    "font_style" TEXT,
    "text_color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customization_pkey" PRIMARY KEY ("customization_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customization_order_item_id_key" ON "Customization"("order_item_id");

-- AddForeignKey
ALTER TABLE "Customization" ADD CONSTRAINT "Customization_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "OrderItem"("order_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
