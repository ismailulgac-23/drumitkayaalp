-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "commissionRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fcmToken" TEXT;
