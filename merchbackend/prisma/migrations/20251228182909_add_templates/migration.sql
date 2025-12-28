-- CreateTable
CREATE TABLE "CustomizationTemplate" (
    "template_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "preview_image" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomizationTemplate_pkey" PRIMARY KEY ("template_id")
);
