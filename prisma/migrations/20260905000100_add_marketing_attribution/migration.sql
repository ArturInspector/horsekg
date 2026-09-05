-- AlterEnum
ALTER TYPE "AnalyticsEventType" ADD VALUE 'LEAD_CREATED';

-- CreateTable
CREATE TABLE "MarketingClick" (
    "id" TEXT NOT NULL,
    "clickId" TEXT NOT NULL,
    "source" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "campaignId" TEXT,
    "adSetId" TEXT,
    "adId" TEXT,
    "fbclid" TEXT,
    "gclid" TEXT,
    "yclid" TEXT,
    "pagePath" TEXT,
    "target" TEXT,
    "sessionId" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingClick_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "AnalyticsEvent"
ADD COLUMN "clickId" TEXT,
ADD COLUMN "utmSource" TEXT,
ADD COLUMN "utmMedium" TEXT,
ADD COLUMN "utmCampaign" TEXT,
ADD COLUMN "utmContent" TEXT,
ADD COLUMN "utmTerm" TEXT,
ADD COLUMN "campaignId" TEXT,
ADD COLUMN "adSetId" TEXT,
ADD COLUMN "adId" TEXT,
ADD COLUMN "fbclid" TEXT,
ADD COLUMN "gclid" TEXT,
ADD COLUMN "yclid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MarketingClick_clickId_key" ON "MarketingClick"("clickId");

-- CreateIndex
CREATE INDEX "MarketingClick_source_createdAt_idx" ON "MarketingClick"("source", "createdAt");

-- CreateIndex
CREATE INDEX "MarketingClick_utmSource_createdAt_idx" ON "MarketingClick"("utmSource", "createdAt");

-- CreateIndex
CREATE INDEX "MarketingClick_utmCampaign_createdAt_idx" ON "MarketingClick"("utmCampaign", "createdAt");

-- CreateIndex
CREATE INDEX "MarketingClick_sessionId_createdAt_idx" ON "MarketingClick"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_clickId_createdAt_idx" ON "AnalyticsEvent"("clickId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_utmSource_createdAt_idx" ON "AnalyticsEvent"("utmSource", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_utmCampaign_createdAt_idx" ON "AnalyticsEvent"("utmCampaign", "createdAt");

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_clickId_fkey" FOREIGN KEY ("clickId") REFERENCES "MarketingClick"("clickId") ON DELETE SET NULL ON UPDATE CASCADE;
