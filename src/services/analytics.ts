import type { AnalyticsEventType, Prisma } from "../generated/prisma/client.js";
import type { DbClient } from "../database.js";

type TrackAnalyticsInput = {
  type: AnalyticsEventType;
  source?: string;
  pagePath?: string;
  target?: string;
  sessionId?: string;
  telegramUserId?: number;
  userAgent?: string;
  referrer?: string;
  metadata?: unknown;
};

type AnalyticsSummaryRange = {
  from: Date;
  to: Date;
};

const SOURCE_PATTERN = /^[a-zA-Z0-9_-]{1,80}$/;

function cleanText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function cleanSource(value: string | undefined) {
  const source = cleanText(value, 80);
  return source && SOURCE_PATTERN.test(source) ? source : undefined;
}

function toJsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export class AnalyticsService {
  constructor(private readonly db: DbClient) {}

  async track(input: TrackAnalyticsInput) {
    await this.db.analyticsEvent.create({
      data: {
        type: input.type,
        source: cleanSource(input.source),
        pagePath: cleanText(input.pagePath, 300),
        target: cleanText(input.target, 120),
        sessionId: cleanText(input.sessionId, 120),
        telegramUserId:
          input.telegramUserId === undefined ? undefined : BigInt(input.telegramUserId),
        userAgent: cleanText(input.userAgent, 500),
        referrer: cleanText(input.referrer, 500),
        metadata: toJsonValue(input.metadata)
      }
    });
  }

  async summary({ from, to }: AnalyticsSummaryRange) {
    const where: Prisma.AnalyticsEventWhereInput = {
      createdAt: {
        gte: from,
        lte: to
      }
    };

    const [byType, bySource, byTarget] = await Promise.all([
      this.db.analyticsEvent.groupBy({
        by: ["type"],
        where,
        _count: { _all: true }
      }),
      this.db.analyticsEvent.groupBy({
        by: ["source"],
        where,
        _count: { _all: true }
      }),
      this.db.analyticsEvent.groupBy({
        by: ["target"],
        where,
        _count: { _all: true }
      })
    ]);

    const countFor = (type: AnalyticsEventType) =>
      byType.find((item) => item.type === type)?._count._all ?? 0;
    const sortCounts = <T extends { count: number }>(items: T[]) =>
      items.sort((left, right) => right.count - left.count);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      totals: {
        pageViews: countFor("PAGE_VIEW"),
        telegramClicks: countFor("TELEGRAM_CLICK"),
        botStarts: countFor("BOT_START"),
        bookingsCreated: countFor("BOOKING_CREATED")
      },
      bySource: sortCounts(
        bySource
          .filter((item) => item.source)
          .map((item) => ({
            source: item.source as string,
            count: item._count._all
          }))
      ),
      byTarget: sortCounts(
        byTarget
          .filter((item) => item.target)
          .map((item) => ({
            target: item.target as string,
            count: item._count._all
          }))
      )
    };
  }
}
