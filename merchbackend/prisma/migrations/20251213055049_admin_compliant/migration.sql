-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "admin_reply" TEXT,
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OPEN';
