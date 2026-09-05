import { randomBytes } from "node:crypto";
import type { AnalyticsEventType, Prisma } from "../generated/prisma/client.js";
import type { DbClient } from "../database.js";

export type MarketingAttribution = {
  clickId?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  campaignId?: string;
  adSetId?: string;
  adId?: string;
  fbclid?: string;
  gclid?: string;
  yclid?: string;
};

type TrackAnalyticsInput = MarketingAttribution & {
  type: AnalyticsEventType;
  pagePath?: string;
  target?: string;
  sessionId?: string;
  telegramUserId?: number;
  userAgent?: string;
  referrer?: string;
  metadata?: unknown;
};

type CreateMarketingClickInput = MarketingAttribution & {
  pagePath?: string;
  target?: string;
  sessionId?: string;
  userAgent?: string;
  referrer?: string;
  metadata?: unknown;
};

type AnalyticsSummaryRange = {
  from: Date;
  to: Date;
};

type FunnelCounts = {
  pageViews: number;
  telegramClicks: number;
  botStarts: number;
  leadsCreated: number;
  bookingsCreated: number;
};

type FunnelGroup = FunnelCounts & {
  key: string;
  name: string;
  totalEvents: number;
};

const SOURCE_PATTERN = /^[a-zA-Z0-9_.-]{1,120}$/;
const CLICK_ID_PATTERN = /^hs_[a-zA-Z0-9_-]{6,40}$/;

const SOURCE_LABELS: Record<string, string> = {
  browser_manual_fetch: "Проверка браузера",
  browser_probe_retry: "Проверка браузера",
  instagram: "Instagram",
  ig: "Instagram",
  meta: "Instagram/Facebook",
  facebook: "Facebook",
  google: "Google",
  seo_home: "Сайт: главный экран",
  seo_booking: "Сайт: блок записи",
  seo_routes: "Сайт: маршруты",
  seo_proof: "Сайт: фото и доверие",
  prod_cli_check: "Проверка API",
  telegram: "Telegram"
};

const TARGET_LABELS: Record<string, string> = {
  deploy_check: "Проверка деплоя",
  hero_primary: "Главная кнопка сверху",
  quick_booking: "Быстрый выбор времени",
  proof_cta: "Блок фото и доверия",
  route_alamedin_first_ride: "Маршрут: Аламедин для первого раза",
  route_chunkurchak_1h: "Маршрут: Чункурчак 1 час",
  route_chunkurchak_2h: "Маршрут: Чункурчак 2 часа",
  telegram_bot: "Telegram-бот"
};

function cleanText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function cleanToken(value: string | undefined, maxLength = 120) {
  const token = cleanText(value, maxLength);
  return token && SOURCE_PATTERN.test(token) ? token : undefined;
}

function cleanClickId(value: string | undefined) {
  const clickId = cleanText(value, 48);
  return clickId && CLICK_ID_PATTERN.test(clickId) ? clickId : undefined;
}

function cleanAttribution(input: MarketingAttribution): MarketingAttribution {
  return {
    clickId: cleanClickId(input.clickId),
    source: cleanToken(input.source),
    utmSource: cleanToken(input.utmSource),
    utmMedium: cleanToken(input.utmMedium),
    utmCampaign: cleanText(input.utmCampaign, 160),
    utmContent: cleanText(input.utmContent, 160),
    utmTerm: cleanText(input.utmTerm, 160),
    campaignId: cleanToken(input.campaignId),
    adSetId: cleanToken(input.adSetId),
    adId: cleanToken(input.adId),
    fbclid: cleanText(input.fbclid, 500),
    gclid: cleanText(input.gclid, 500),
    yclid: cleanText(input.yclid, 500)
  };
}

function toJsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function createClickId() {
  return `hs_${randomBytes(8).toString("base64url")}`;
}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function zeroCounts(): FunnelCounts {
  return {
    pageViews: 0,
    telegramClicks: 0,
    botStarts: 0,
    leadsCreated: 0,
    bookingsCreated: 0
  };
}

function addEvent(counts: FunnelCounts, type: AnalyticsEventType) {
  if (type === "PAGE_VIEW") {
    counts.pageViews += 1;
  }

  if (type === "TELEGRAM_CLICK") {
    counts.telegramClicks += 1;
  }

  if (type === "BOT_START") {
    counts.botStarts += 1;
  }

  if (type === "LEAD_CREATED") {
    counts.leadsCreated += 1;
  }

  if (type === "BOOKING_CREATED") {
    counts.bookingsCreated += 1;
  }
}

function percent(part: number, whole: number) {
  return whole === 0 ? 0 : Math.min(100, Number(((part / whole) * 100).toFixed(1)));
}

function humanValue(value: string | undefined) {
  if (!value) {
    return "Неизвестно";
  }

  return SOURCE_LABELS[value] ?? value.replace(/[_-]/g, " ");
}

function humanTarget(value: string | undefined) {
  if (!value) {
    return "Неизвестно";
  }

  return TARGET_LABELS[value] ?? value.replace(/[_-]/g, " ");
}

function sourceKey(event: Pick<MarketingAttribution, "source" | "utmSource">) {
  return event.utmSource ?? event.source ?? "unknown";
}

function sourceName(event: Pick<MarketingAttribution, "source" | "utmSource">) {
  return humanValue(sourceKey(event));
}

function incrementGroup(
  groups: Map<string, FunnelGroup>,
  key: string,
  name: string,
  type: AnalyticsEventType
) {
  const group = groups.get(key) ?? {
    key,
    name,
    totalEvents: 0,
    ...zeroCounts()
  };

  group.totalEvents += 1;
  addEvent(group, type);
  groups.set(key, group);
}

function groupToRow(group: FunnelGroup) {
  return {
    key: group.key,
    name: group.name,
    visits: group.pageViews,
    telegramClicks: group.telegramClicks,
    botStarts: group.botStarts,
    leads: group.leadsCreated,
    bookings: group.bookingsCreated,
    clickRate: percent(group.telegramClicks, group.pageViews),
    leadRate: percent(group.leadsCreated, group.telegramClicks),
    bookingRate: percent(group.bookingsCreated, group.leadsCreated)
  };
}

function sortGroups(groups: Map<string, FunnelGroup>) {
  return [...groups.values()]
    .sort((left, right) => right.totalEvents - left.totalEvents)
    .map(groupToRow);
}

export class AnalyticsService {
  constructor(private readonly db: DbClient) {}

  async createTelegramClick(input: CreateMarketingClickInput) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const clickId = createClickId();
      const attribution = cleanAttribution({
        ...input,
        clickId,
        source: input.utmSource ?? input.source
      });

      try {
        await this.db.marketingClick.create({
          data: {
            ...attribution,
            clickId,
            pagePath: cleanText(input.pagePath, 500),
            target: cleanText(input.target, 120),
            sessionId: cleanText(input.sessionId, 120),
            userAgent: cleanText(input.userAgent, 500),
            referrer: cleanText(input.referrer, 500),
            metadata: toJsonValue(input.metadata)
          }
        });

        await this.track({
          type: "TELEGRAM_CLICK",
          ...attribution,
          pagePath: input.pagePath,
          target: input.target,
          sessionId: input.sessionId,
          userAgent: input.userAgent,
          referrer: input.referrer,
          metadata: input.metadata
        });

        return {
          clickId,
          source: attribution.source,
          sourceName: sourceName(attribution)
        };
      } catch (error) {
        if (isUniqueConflict(error)) {
          continue;
        }

        throw error;
      }
    }

    throw new Error("Failed to allocate analytics click id");
  }

  async findClickAttribution(clickId: string): Promise<MarketingAttribution | undefined> {
    const cleanId = cleanClickId(clickId);

    if (!cleanId) {
      return undefined;
    }

    const click = await this.db.marketingClick.findUnique({
      where: {
        clickId: cleanId
      },
      select: {
        clickId: true,
        source: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        utmContent: true,
        utmTerm: true,
        campaignId: true,
        adSetId: true,
        adId: true,
        fbclid: true,
        gclid: true,
        yclid: true
      }
    });

    return click
      ? {
          clickId: click.clickId,
          source: click.source ?? undefined,
          utmSource: click.utmSource ?? undefined,
          utmMedium: click.utmMedium ?? undefined,
          utmCampaign: click.utmCampaign ?? undefined,
          utmContent: click.utmContent ?? undefined,
          utmTerm: click.utmTerm ?? undefined,
          campaignId: click.campaignId ?? undefined,
          adSetId: click.adSetId ?? undefined,
          adId: click.adId ?? undefined,
          fbclid: click.fbclid ?? undefined,
          gclid: click.gclid ?? undefined,
          yclid: click.yclid ?? undefined
        }
      : undefined;
  }

  async track(input: TrackAnalyticsInput) {
    const attribution = cleanAttribution(input);

    await this.db.analyticsEvent.create({
      data: {
        type: input.type,
        ...attribution,
        source: attribution.source ?? attribution.utmSource,
        pagePath: cleanText(input.pagePath, 500),
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

    const events = await this.db.analyticsEvent.findMany({
      where,
      select: {
        type: true,
        clickId: true,
        source: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        utmContent: true,
        target: true
      }
    });
    const clickIds = [
      ...new Set(
        events
          .map((event) => event.clickId)
          .filter((clickId): clickId is string => Boolean(clickId))
      )
    ];
    const clicks = await this.db.marketingClick.findMany({
      where: {
        clickId: {
          in: clickIds
        }
      },
      select: {
        clickId: true,
        source: true,
        utmSource: true,
        utmCampaign: true,
        target: true
      }
    });
    const clickById = new Map(clicks.map((click) => [click.clickId, click]));

    const totals = zeroCounts();
    const sourceGroups = new Map<string, FunnelGroup>();
    const campaignGroups = new Map<string, FunnelGroup>();
    const buttonGroups = new Map<string, FunnelGroup>();

    for (const event of events) {
      const click = event.clickId ? clickById.get(event.clickId) : undefined;
      const attributed = {
        source: event.source ?? click?.source ?? undefined,
        utmSource: event.utmSource ?? click?.utmSource ?? undefined
      };
      const campaign = event.utmCampaign ?? click?.utmCampaign ?? undefined;
      const target = click?.target ?? event.target ?? undefined;

      addEvent(totals, event.type);

      const bySourceKey = sourceKey(attributed);
      incrementGroup(sourceGroups, bySourceKey, sourceName(attributed), event.type);

      if (campaign) {
        incrementGroup(
          campaignGroups,
          campaign,
          humanValue(campaign),
          event.type
        );
      }

      if (target) {
        incrementGroup(buttonGroups, target, humanTarget(target), event.type);
      }
    }

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      labels: {
        visits: "Посещения сайта",
        telegramClicks: "Нажали кнопку Telegram",
        botStarts: "Открыли бота",
        leads: "Оставили телефон",
        bookings: "Создали бронь"
      },
      totals: {
        ...totals,
        visits: totals.pageViews,
        telegramClicks: totals.telegramClicks,
        botStarts: totals.botStarts,
        leads: totals.leadsCreated,
        bookings: totals.bookingsCreated,
        clickRate: percent(totals.telegramClicks, totals.pageViews),
        leadRate: percent(totals.leadsCreated, totals.telegramClicks),
        bookingRate: percent(totals.bookingsCreated, totals.leadsCreated)
      },
      funnel: [
        {
          key: "visits",
          label: "Посещения сайта",
          count: totals.pageViews,
          note: "Открыли лендинг"
        },
        {
          key: "telegramClicks",
          label: "Нажали кнопку Telegram",
          count: totals.telegramClicks,
          note: "Перешли с сайта в бот"
        },
        {
          key: "botStarts",
          label: "Открыли бота",
          count: totals.botStarts,
          note: "Бот получил команду /start"
        },
        {
          key: "leads",
          label: "Оставили телефон",
          count: totals.leadsCreated,
          note: "Это считаем заявкой"
        },
        {
          key: "bookings",
          label: "Создали бронь",
          count: totals.bookingsCreated,
          note: "Заявка превратилась в бронь"
        }
      ],
      sources: sortGroups(sourceGroups),
      campaigns: sortGroups(campaignGroups),
      buttons: sortGroups(buttonGroups),
      bySource: sortGroups(sourceGroups).map((item) => ({
        source: item.key,
        count:
          item.visits +
          item.telegramClicks +
          item.botStarts +
          item.leads +
          item.bookings
      })),
      byTarget: sortGroups(buttonGroups).map((item) => ({
        target: item.key,
        count:
          item.visits +
          item.telegramClicks +
          item.botStarts +
          item.leads +
          item.bookings
      }))
    };
  }
}
