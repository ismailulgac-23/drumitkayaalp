-- CreateTable
CREATE TABLE "charity_activities" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "estimatedEndTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charity_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "charity_activities_providerId_idx" ON "charity_activities"("providerId");

-- CreateIndex
CREATE INDEX "charity_activities_categoryId_idx" ON "charity_activities"("categoryId");

-- CreateIndex
CREATE INDEX "charity_activities_latitude_longitude_idx" ON "charity_activities"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "charity_activities" ADD CONSTRAINT "charity_activities_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charity_activities" ADD CONSTRAINT "charity_activities_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
