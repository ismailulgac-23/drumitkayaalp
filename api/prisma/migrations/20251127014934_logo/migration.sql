-- CreateTable
CREATE TABLE "Logo" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Logo_type_idx" ON "Logo"("type");

-- CreateIndex
CREATE INDEX "Logo_isActive_idx" ON "Logo"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Logo_type_key" ON "Logo"("type");
