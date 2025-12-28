-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "tax_amount" DROP NOT NULL,
ALTER COLUMN "shipping_cost" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "discount_amount" DROP NOT NULL,
ALTER COLUMN "tax_amount" DROP NOT NULL;
