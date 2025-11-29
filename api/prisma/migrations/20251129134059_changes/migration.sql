-- CreateTable
CREATE TABLE "HomeIntro" (
    "id" TEXT NOT NULL,
    "smallTitle" TEXT,
    "mainTitle" TEXT NOT NULL,
    "subTitle" TEXT,
    "description" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "backgroundImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeIntro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarqueeItem" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarqueeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeAbout" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "smallTitle" TEXT,
    "title" TEXT,
    "content" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeAbout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marquee2Item" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marquee2Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPageIntro" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "title" TEXT,
    "content" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPageIntro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMap" (
    "id" TEXT NOT NULL,
    "iframeCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomeIntro_isActive_idx" ON "HomeIntro"("isActive");

-- CreateIndex
CREATE INDEX "MarqueeItem_isActive_idx" ON "MarqueeItem"("isActive");

-- CreateIndex
CREATE INDEX "MarqueeItem_order_idx" ON "MarqueeItem"("order");

-- CreateIndex
CREATE INDEX "HomeAbout_isActive_idx" ON "HomeAbout"("isActive");

-- CreateIndex
CREATE INDEX "Skill_isActive_idx" ON "Skill"("isActive");

-- CreateIndex
CREATE INDEX "Skill_order_idx" ON "Skill"("order");

-- CreateIndex
CREATE INDEX "Marquee2Item_isActive_idx" ON "Marquee2Item"("isActive");

-- CreateIndex
CREATE INDEX "Marquee2Item_order_idx" ON "Marquee2Item"("order");

-- CreateIndex
CREATE INDEX "AboutPageIntro_isActive_idx" ON "AboutPageIntro"("isActive");

-- CreateIndex
CREATE INDEX "ContactMap_isActive_idx" ON "ContactMap"("isActive");
