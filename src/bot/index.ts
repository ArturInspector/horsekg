import { Bot, InlineKeyboard, Keyboard, session } from "grammy";
import type { AppConfig } from "../config.js";
import type { DbClient } from "../database.js";
import { AnalyticsService, type MarketingAttribution } from "../services/analytics.js";
import { BookingService } from "../services/bookings.js";
import { CatalogService } from "../services/catalog.js";
import { DomainError } from "../services/errors.js";
import { PaymentService } from "../services/payments.js";
import { formatDateTime, formatTimeRange } from "../utils/dates.js";
import type { BotContext } from "./context.js";
import { initialSession } from "./context.js";
import { PrismaSessionStorage } from "./session-storage.js";

type CreateBotDeps = {
  config: AppConfig;
  db: DbClient;
};

type BookingDetails = {
  publicCode: string;
  status: string;
  participants: number;
  contactPhone: string;
  totalAmountKgs: number;
  paidAmountKgs: number;
  location: {
    title: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    mapUrl: string | null;
  };
  ridePackage: {
    title: string;
    durationMinutes: number;
    priceKgs: number;
  };
  slot: {
    startsAt: Date;
    endsAt: Date;
  };
  horse: {
    name: string;
  } | null;
};

type AnalyticsSummary = Awaited<ReturnType<AnalyticsService["summary"]>>;

function mainKeyboard() {
  return new Keyboard()
    .text("Записаться")
    .text("Лошади")
    .row()
    .text("Локации")
    .text("Мои брони")
    .resized();
}

function removeKeyboard() {
  return { remove_keyboard: true } as const;
}

function formatMoney(amountKgs: number) {
  return `${amountKgs.toLocaleString("ru-RU")} сом`;
}

function normalizePhone(value: string) {
  const normalized = value.replace(/[^\d+]/g, "");
  return normalized.length >= 7 ? normalized : null;
}

function normalizeSource(value: string | undefined) {
  const source = value?.trim();
  return source && /^[a-zA-Z0-9_-]{1,120}$/.test(source) ? source : undefined;
}

function startPayload(ctx: BotContext) {
  const message = ctx.message;

  if (!message || !("text" in message)) {
    return undefined;
  }

  if (typeof message.text !== "string") {
    return undefined;
  }

  const [, payload] = message.text.trim().split(/\s+/, 2);
  return normalizeSource(payload);
}

function hasCoordinates<T extends { latitude: number | null; longitude: number | null }>(
  location: T
): location is T & { latitude: number; longitude: number } {
  return location.latitude !== null && location.longitude !== null;
}

function mapUrlLabel(mapUrl: string) {
  return mapUrl.includes("2gis.") ? "Открыть в 2GIS" : "Открыть карту";
}

function telegramUser(ctx: BotContext) {
  if (!ctx.from) {
    return undefined;
  }

  return {
    id: ctx.from.id,
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name
  };
}

function contactName(ctx: BotContext) {
  return [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(" ");
}

function humanToken(value: string | undefined) {
  return value ? value.replace(/[_-]/g, " ") : undefined;
}

function humanSource(value: string | undefined) {
  const labels: Record<string, string> = {
    facebook: "Facebook",
    google: "Google",
    ig: "Instagram",
    instagram: "Instagram",
    meta: "Instagram/Facebook",
    seo_booking: "Сайт, блок записи",
    seo_home: "Сайт, главный экран",
    seo_proof: "Сайт, блок фото",
    seo_routes: "Сайт, маршруты",
    telegram: "Telegram"
  };

  return value ? labels[value] ?? humanToken(value) : undefined;
}

function currentAttribution(ctx: BotContext): MarketingAttribution {
  return ctx.session.attribution ?? { source: ctx.session.source };
}

function managerAttributionText(attribution: MarketingAttribution | undefined) {
  const source = humanSource(attribution?.utmSource ?? attribution?.source);
  const lines = [
    "Откуда пришел клиент",
    `Источник: ${source ?? "не видно"}`,
    attribution?.utmCampaign
      ? `Кампания: ${humanToken(attribution.utmCampaign)}`
      : undefined,
    attribution?.utmContent
      ? `Объявление/кнопка: ${humanToken(attribution.utmContent)}`
      : undefined,
    attribution?.utmMedium ? `Тип трафика: ${humanToken(attribution.utmMedium)}` : undefined,
    attribution?.clickId ? `ID перехода: ${attribution.clickId}` : undefined
  ];

  return lines.filter(Boolean).join("\n");
}

function formatRate(value: number) {
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
}

function formatStats(summary: AnalyticsSummary) {
  const topSources = summary.sources.slice(0, 5);
  const sourceLines = topSources.length
    ? topSources.map(
        (source) =>
          `${source.name}: сайт ${source.visits}, Telegram ${source.telegramClicks}, заявки ${source.leads}, брони ${source.bookings}`
      )
    : ["Пока нет источников за период."];

  return [
    "Отчет за 30 дней",
    "",
    `Посещения сайта: ${summary.totals.visits}`,
    `Нажали Telegram: ${summary.totals.telegramClicks}`,
    `Открыли бота: ${summary.totals.botStarts}`,
    `Оставили телефон: ${summary.totals.leads}`,
    `Создали бронь: ${summary.totals.bookings}`,
    "",
    `Из сайта в Telegram: ${formatRate(summary.totals.clickRate)}`,
    `Из Telegram в заявку: ${formatRate(summary.totals.leadRate)}`,
    "",
    "Откуда пришли:",
    ...sourceLines
  ].join("\n");
}

function bookingSummary(booking: BookingDetails) {
  const horse = booking.horse?.name ?? "подберем на месте";

  return [
    `Бронь ${booking.publicCode}`,
    `${booking.ridePackage.title}`,
    `Когда: ${formatTimeRange(booking.slot.startsAt, booking.slot.endsAt)}`,
    `Локация: ${booking.location.title}`,
    `Лошадь: ${horse}`,
    `Участников: ${booking.participants}`,
    `Сумма: ${formatMoney(booking.totalAmountKgs)}`,
    `Телефон: ${booking.contactPhone}`,
    `Статус: ${booking.status}`
  ].join("\n");
}

async function safeAnswerCallback(ctx: BotContext) {
  await ctx.answerCallbackQuery().catch(() => undefined);
}

export function createBot({ config, db }: CreateBotDeps) {
  if (!config.telegramBotToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is required to create bot");
  }

  const bot = new Bot<BotContext>(config.telegramBotToken);
  const analytics = new AnalyticsService(db);
  const catalog = new CatalogService(db);
  const bookings = new BookingService(db);
  const payments = new PaymentService(db);

  bot.use(
    session({
      initial: initialSession,
      prefix: "telegram:",
      storage: new PrismaSessionStorage(db),
      getSessionKey: (ctx) =>
        ctx.chat?.id !== undefined
          ? String(ctx.chat.id)
          : ctx.from?.id !== undefined
            ? `user:${ctx.from.id}`
            : undefined
    })
  );

  bot.catch((error) => {
    console.error("Telegram bot error", error.error);
  });

  async function applyStartPayload(ctx: BotContext) {
    const payload = startPayload(ctx);

    if (!payload) {
      return currentAttribution(ctx);
    }

    if (payload.startsWith("hs_")) {
      const attribution = await analytics
        .findClickAttribution(payload)
        .catch((error: unknown) => {
          console.error("Failed to resolve analytics click", error);
          return undefined;
        });

      ctx.session.attribution = attribution ?? {
        clickId: payload,
        source: payload
      };
    } else {
      ctx.session.attribution = {
        source: payload
      };
    }

    ctx.session.source = ctx.session.attribution.source;
    return ctx.session.attribution;
  }

  async function trackBotStart(ctx: BotContext) {
    const attribution = await applyStartPayload(ctx);

    analytics
      .track({
        type: "BOT_START",
        ...attribution,
        target: "telegram_bot",
        telegramUserId: ctx.from?.id,
        metadata: {
          username: ctx.from?.username,
          firstName: ctx.from?.first_name,
          lastName: ctx.from?.last_name
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to track bot start", error);
      });
  }

  async function showHome(ctx: BotContext) {
    await ctx.reply(
      [
        "HorseSharing Бишкек",
        "",
        "Можно выбрать локацию, маршрут, время, лошадь и оставить бронь."
      ].join("\n"),
      { reply_markup: mainKeyboard() }
    );
  }

  async function handleStart(ctx: BotContext) {
    await trackBotStart(ctx);
    await showHome(ctx);
  }

  async function showLocations(ctx: BotContext) {
    const locations = await catalog.listLocations();

    if (locations.length === 0) {
      await ctx.reply("Пока нет активных локаций.");
      return;
    }

    const keyboard = new InlineKeyboard();

    for (const location of locations) {
      keyboard.text(location.title, `book:loc:${location.id}`).row();
    }

    await ctx.reply("Выберите локацию:", { reply_markup: keyboard });
  }

  async function showLocationInfo(ctx: BotContext) {
    const locations = await catalog.listLocations();

    if (locations.length === 0) {
      await ctx.reply("Пока нет активных локаций.");
      return;
    }

    for (const location of locations) {
      const keyboard = new InlineKeyboard().text(
        "Записаться сюда",
        `book:loc:${location.id}`
      );

      if (hasCoordinates(location)) {
        keyboard.row().text("Показать точку", `loc:map:${location.id}`);
      }

      if (location.mapUrl) {
        keyboard.row().url(mapUrlLabel(location.mapUrl), location.mapUrl);
      }

      await ctx.reply(
        [
          location.title,
          location.description,
          location.address ? `Адрес: ${location.address}` : undefined
        ]
          .filter(Boolean)
          .join("\n"),
        { reply_markup: keyboard }
      );
    }
  }

  async function showPackages(ctx: BotContext, locationId: string) {
    ctx.session.draft = { locationId };

    const packages = await catalog.listRidePackages(locationId);

    if (packages.length === 0) {
      await ctx.reply("Для этой локации пока нет активных маршрутов.");
      return;
    }

    const keyboard = new InlineKeyboard();

    for (const ridePackage of packages) {
      keyboard
        .text(
          `${ridePackage.title} · ${formatMoney(ridePackage.priceKgs)}`,
          `book:pkg:${ridePackage.id}`
        )
        .row();
    }

    await ctx.reply("Выберите маршрут:", { reply_markup: keyboard });
  }

  async function showSlots(ctx: BotContext, packageId: string) {
    const locationId = ctx.session.draft?.locationId;

    if (!locationId) {
      await ctx.reply("Сначала выберите локацию.");
      await showLocations(ctx);
      return;
    }

    ctx.session.draft = {
      ...ctx.session.draft,
      packageId
    };

    const slots = await catalog.listSlots({
      locationId,
      packageId,
      limit: 12
    });

    if (slots.length === 0) {
      await ctx.reply("На ближайшие даты свободных слотов нет.");
      return;
    }

    const keyboard = new InlineKeyboard();

    for (const slot of slots) {
      const seatsLeft = slot.capacity - slot.seatsBooked;
      keyboard
        .text(
          `${formatDateTime(slot.startsAt)} · ${seatsLeft} мест`,
          `book:slot:${slot.id}`
        )
        .row();
    }

    await ctx.reply("Выберите время:", { reply_markup: keyboard });
  }

  async function showHorseChoice(ctx: BotContext, slotId: string) {
    const locationId = ctx.session.draft?.locationId;

    if (!locationId) {
      await ctx.reply("Сначала выберите локацию.");
      await showLocations(ctx);
      return;
    }

    ctx.session.draft = {
      ...ctx.session.draft,
      slotId
    };

    const horses = await catalog.listHorses(locationId);
    const keyboard = new InlineKeyboard().text(
      "Подберем на месте",
      "book:horse:any"
    );

    for (const horse of horses.slice(0, 8)) {
      keyboard.row().text(horse.name, `book:horse:${horse.id}`);
    }

    await ctx.reply("Выберите лошадь:", { reply_markup: keyboard });
  }

  async function showParticipants(ctx: BotContext, horseId?: string) {
    ctx.session.draft = {
      ...ctx.session.draft,
      horseId
    };

    const keyboard = new InlineKeyboard();

    for (const value of [1, 2, 3, 4, 5, 6]) {
      keyboard.text(String(value), `book:party:${value}`);
    }

    await ctx.reply("Сколько участников?", { reply_markup: keyboard });
  }

  async function askPhone(ctx: BotContext, participants: number) {
    ctx.session.draft = {
      ...ctx.session.draft,
      participants,
      awaitingPhone: true
    };

    const keyboard = new Keyboard()
      .requestContact("Отправить телефон")
      .row()
      .text("Ввести вручную")
      .resized()
      .oneTime();

    await ctx.reply("Оставьте телефон для подтверждения брони:", {
      reply_markup: keyboard
    });
  }

  async function sendPaymentOrManual(ctx: BotContext, publicCode: string) {
    if (!config.paymentsProviderToken) {
      const keyboard = new InlineKeyboard().text(
        "Оплатить позже",
        `pay:${publicCode}`
      );

      await ctx.reply(
        "Платежный provider token не настроен, бронь ушла в ручное подтверждение.",
        { reply_markup: keyboard }
      );
      return;
    }

    const invoice = await payments.prepareTelegramInvoice(publicCode);

    await ctx.replyWithInvoice(
      invoice.title,
      invoice.description,
      invoice.payload,
      invoice.currency,
      invoice.prices,
      {
        provider_token: config.paymentsProviderToken,
        need_phone_number: true,
        send_phone_number_to_provider: true,
        start_parameter: invoice.payload,
        photo_url: invoice.photoUrl
      }
    );
  }

  async function notifyManager(
    ctx: BotContext,
    booking: BookingDetails,
    attribution?: MarketingAttribution
  ) {
    if (!config.managerChatId) {
      return;
    }

    await ctx.api
      .sendMessage(
        config.managerChatId,
        `Новая бронь\n\n${bookingSummary(booking)}\n\n${managerAttributionText(attribution)}`
      )
      .catch((error: unknown) => {
        console.error("Failed to notify manager", error);
      });
  }

  function isManagerChat(ctx: BotContext) {
    return (
      Boolean(config.managerChatId) &&
      ctx.chat?.id !== undefined &&
      String(ctx.chat.id) === config.managerChatId
    );
  }

  async function completeBooking(ctx: BotContext, rawPhone: string) {
    const draft = ctx.session.draft;
    const phone = normalizePhone(rawPhone);

    if (!phone) {
      await ctx.reply("Не похоже на телефон. Напишите номер еще раз.");
      return;
    }

    if (!draft?.slotId || !draft.participants) {
      await ctx.reply("Бронь не собрана. Начните заново через /book.", {
        reply_markup: mainKeyboard()
      });
      ctx.session.draft = undefined;
      return;
    }

    try {
      const attribution = currentAttribution(ctx);

      analytics
        .track({
          type: "LEAD_CREATED",
          ...attribution,
          target: "telegram_bot",
          telegramUserId: ctx.from?.id,
          metadata: {
            participants: draft.participants,
            phoneLast4: phone.slice(-4)
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to track lead", error);
        });

      const booking = await bookings.createBooking({
        telegramUser: telegramUser(ctx),
        slotId: draft.slotId,
        horseId: draft.horseId,
        participants: draft.participants,
        contactName: contactName(ctx),
        contactPhone: phone,
        paymentExpected: Boolean(config.paymentsProviderToken)
      });

      analytics
        .track({
          type: "BOOKING_CREATED",
          ...attribution,
          target: "telegram_bot",
          telegramUserId: ctx.from?.id,
          metadata: {
            publicCode: booking.publicCode,
            participants: booking.participants,
            totalAmountKgs: booking.totalAmountKgs,
            location: booking.location.title,
            ridePackage: booking.ridePackage.title
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to track booking", error);
        });

      ctx.session.draft = undefined;

      await ctx.reply(bookingSummary(booking), {
        reply_markup: removeKeyboard()
      });
      await sendPaymentOrManual(ctx, booking.publicCode);
      await notifyManager(ctx, booking, attribution);
    } catch (error) {
      if (error instanceof DomainError) {
        await ctx.reply(error.message, { reply_markup: mainKeyboard() });
        return;
      }

      throw error;
    }
  }

  async function showHorses(ctx: BotContext, locationId?: string) {
    const horses = await catalog.listHorses(locationId);

    if (horses.length === 0) {
      await ctx.reply("Пока нет доступных лошадей.");
      return;
    }

    for (const horse of horses.slice(0, 10)) {
      const text = [
        horse.name,
        horse.color ? `Масть: ${horse.color}` : undefined,
        horse.age ? `Возраст: ${horse.age}` : undefined,
        horse.location?.title ? `Локация: ${horse.location.title}` : undefined,
        horse.description
      ]
        .filter(Boolean)
        .join("\n");

      if (horse.photoUrl) {
        await ctx.replyWithPhoto(horse.photoUrl, { caption: text });
      } else {
        await ctx.reply(text);
      }
    }
  }

  bot.command("start", handleStart);
  bot.command("book", showLocations);
  bot.command("horses", (ctx) => showHorses(ctx));
  bot.command("locations", showLocationInfo);
  bot.command("stats", async (ctx) => {
    if (!isManagerChat(ctx)) {
      await ctx.reply("Эта команда доступна только менеджеру.");
      return;
    }

    const from = new Date();
    from.setDate(from.getDate() - 30);

    const summary = await analytics.summary({
      from,
      to: new Date()
    });

    await ctx.reply(formatStats(summary));
  });

  bot.command("my", async (ctx) => {
    if (!ctx.from) {
      await ctx.reply("Не вижу Telegram-пользователя.");
      return;
    }

    const items = await bookings.listCustomerBookings(ctx.from.id);

    if (items.length === 0) {
      await ctx.reply("У вас пока нет броней.");
      return;
    }

    await ctx.reply(items.map(bookingSummary).join("\n\n"));
  });

  bot.on("message:contact", async (ctx) => {
    await completeBooking(ctx, ctx.message.contact.phone_number);
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();

    if (ctx.session.draft?.awaitingPhone) {
      if (text === "Ввести вручную") {
        await ctx.reply("Напишите телефон сообщением:");
        return;
      }

      await completeBooking(ctx, text);
      return;
    }

    if (text === "Записаться") {
      await showLocations(ctx);
      return;
    }

    if (text === "Лошади") {
      await showHorses(ctx);
      return;
    }

    if (text === "Локации") {
      await showLocationInfo(ctx);
      return;
    }

    if (text === "Мои брони") {
      if (!ctx.from) {
        await ctx.reply("Не вижу Telegram-пользователя.");
        return;
      }

      const items = await bookings.listCustomerBookings(ctx.from.id);
      await ctx.reply(
        items.length ? items.map(bookingSummary).join("\n\n") : "У вас пока нет броней."
      );
      return;
    }

    await showHome(ctx);
  });

  bot.callbackQuery("book:start", async (ctx) => {
    await safeAnswerCallback(ctx);
    await showLocations(ctx);
  });

  bot.callbackQuery(/^book:loc:(.+)$/, async (ctx) => {
    await safeAnswerCallback(ctx);
    await showPackages(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^book:pkg:(.+)$/, async (ctx) => {
    await safeAnswerCallback(ctx);
    await showSlots(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^book:slot:(.+)$/, async (ctx) => {
    await safeAnswerCallback(ctx);
    await showHorseChoice(ctx, ctx.match[1]);
  });

  bot.callbackQuery("book:horse:any", async (ctx) => {
    await safeAnswerCallback(ctx);
    await showParticipants(ctx);
  });

  bot.callbackQuery(/^book:horse:(.+)$/, async (ctx) => {
    await safeAnswerCallback(ctx);
    await showParticipants(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^book:party:(\d+)$/, async (ctx) => {
    await safeAnswerCallback(ctx);
    await askPhone(ctx, Number(ctx.match[1]));
  });

  bot.callbackQuery(/^loc:map:(.+)$/, async (ctx) => {
    await safeAnswerCallback(ctx);

    const location = await catalog.getLocation(ctx.match[1]);

    if (hasCoordinates(location)) {
      await ctx.replyWithLocation(location.latitude, location.longitude);
    }

    if (location.mapUrl) {
      await ctx.reply("Открыть карту в приложении:", {
        reply_markup: new InlineKeyboard().url(
          mapUrlLabel(location.mapUrl),
          location.mapUrl
        )
      });
      return;
    }

    await ctx.reply("Карта для этой локации пока не указана.");
  });

  bot.callbackQuery(/^pay:(.+)$/, async (ctx) => {
    await safeAnswerCallback(ctx);
    await sendPaymentOrManual(ctx, ctx.match[1]);
  });

  bot.on("pre_checkout_query", async (ctx) => {
    await ctx.answerPreCheckoutQuery(true);
  });

  bot.on("message:successful_payment", async (ctx) => {
    const booking = await payments.markTelegramPaymentSucceeded(
      ctx.message.successful_payment
    );

    await ctx.reply(
      [
        "Оплата прошла, бронь подтверждена.",
        "",
        bookingSummary(booking)
      ].join("\n")
    );
    await notifyManager(ctx, booking);
  });

  return bot;
}
