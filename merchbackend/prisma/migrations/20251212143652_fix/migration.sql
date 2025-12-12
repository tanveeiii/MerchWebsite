-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wishlist" DROP CONSTRAINT "Wishlist_product_variant_id_fkey";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "product_variant_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Wishlist" ALTER COLUMN "product_variant_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "ProductVariant"("product_variant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "ProductVariant"("product_variant_id") ON DELETE SET NULL ON UPDATE CASCADE;
