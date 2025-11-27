-- CreateTable
CREATE TABLE IF NOT EXISTS "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "cities_name_idx" ON "cities"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "cities_isActive_idx" ON "cities"("isActive");

-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cityId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
