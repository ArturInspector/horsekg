import cors from "@fastify/cors";
import Fastify from "fastify";
import type { Bot } from "grammy";
import type { Update } from "grammy/types";
import { z } from "zod";
import type { AppConfig } from "../config.js";
import type { BotContext } from "../bot/context.js";
import type { DbClient } from "../database.js";
import { AnalyticsService } from "../services/analytics.js";
import { BookingService } from "../services/bookings.js";
import { CatalogService } from "../services/catalog.js";
import { DomainError } from "../services/errors.js";
import { parseDate } from "../utils/dates.js";

type BuildServerDeps = {
  bot?: Bot<BotContext>;
  config: AppConfig;
  db: DbClient;
};

const idQuerySchema = z.object({
  locationId: z.string().optional()
});

const availabilityQuerySchema = z.object({
  locationId: z.string().min(1),
  packageId: z.string().min(1),
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12)
});

const createBookingSchema = z.object({
  telegramUser: z
    .object({
      id: z.number().int().positive(),
      username: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional()
    })
    .optional(),
  slotId: z.string().min(1),
  horseId: z.string().min(1).optional(),
  participants: z.number().int().min(1).max(10),
  contactPhone: z.string().min(7),
  contactName: z.string().optional(),
  notes: z.string().max(1000).optional(),
  paymentExpected: z.boolean().optional()
});

const analyticsEventSchema = z.object({
  type: z.enum(["PAGE_VIEW", "TELEGRAM_CLICK"]),
  source: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/).optional(),
  pagePath: z.string().min(1).max(300).optional(),
  target: z.string().min(1).max(120).optional(),
  sessionId: z.string().min(1).max(120).optional(),
  referrer: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

const analyticsSummaryQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional()
});

function defaultSummaryFrom() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
}

function headerString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function buildServer({ bot, config, db }: BuildServerDeps) {
  const app = Fastify({
    logger: true
  });
  const analytics = new AnalyticsService(db);
  const catalog = new CatalogService(db);
  const bookings = new BookingService(db);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof DomainError) {
      reply.status(error.statusCode).send({
        error: error.code,
        message: error.message
      });
      return;
    }

    if (error instanceof z.ZodError) {
      reply.status(400).send({
        error: "VALIDATION_ERROR",
        issues: error.issues
      });
      return;
    }

    app.log.error(error);
    reply.status(500).send({
      error: "INTERNAL_SERVER_ERROR"
    });
  });

  await app.register(cors, {
    origin: true
  });

  app.get("/health", async () => ({
    ok: true,
    service: "horsesharing",
    botMode: config.telegramBotMode
  }));

  app.get("/api/locations", async () => catalog.listLocations());

  app.get("/api/horses", async (request) => {
    const query = idQuerySchema.parse(request.query);
    return catalog.listHorses(query.locationId);
  });

  app.get("/api/ride-packages", async (request) => {
    const query = idQuerySchema.parse(request.query);
    return catalog.listRidePackages(query.locationId);
  });

  app.get("/api/availability", async (request) => {
    const query = availabilityQuerySchema.parse(request.query);

    return catalog.listSlots({
      locationId: query.locationId,
      packageId: query.packageId,
      from: parseDate(query.from),
      to: parseDate(query.to),
      limit: query.limit
    });
  });

  app.post("/api/bookings", async (request, reply) => {
    const input = createBookingSchema.parse(request.body);
    const booking = await bookings.createBooking(input);
    reply.status(201);
    return booking;
  });

  app.post("/api/analytics/events", async (request, reply) => {
    const input = analyticsEventSchema.parse(request.body);

    await analytics.track({
      ...input,
      userAgent: headerString(request.headers["user-agent"])
    });

    reply.status(204).send();
  });

  app.get("/api/analytics/summary", async (request, reply) => {
    if (config.analyticsAdminToken) {
      const authHeader = request.headers.authorization;
      const headerToken = headerString(request.headers["x-analytics-token"]);
      const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : undefined;

      if (
        bearerToken !== config.analyticsAdminToken &&
        headerToken !== config.analyticsAdminToken
      ) {
        reply.status(401).send({ error: "UNAUTHORIZED" });
        return;
      }
    }

    const query = analyticsSummaryQuerySchema.parse(request.query);
    const from = parseDate(query.from) ?? defaultSummaryFrom();
    const to = parseDate(query.to) ?? new Date();

    return analytics.summary({ from, to });
  });

  if (bot && config.telegramBotMode === "webhook") {
    app.post(config.telegramWebhookPath, async (request, reply) => {
      if (config.telegramWebhookSecret) {
        const secret = request.headers["x-telegram-bot-api-secret-token"];

        if (secret !== config.telegramWebhookSecret) {
          reply.status(401).send({ error: "INVALID_TELEGRAM_SECRET" });
          return;
        }
      }

      try {
        await bot.handleUpdate(request.body as Update);
        return { ok: true };
      } catch (error) {
        app.log.error(error, "Telegram webhook update failed");
        throw error;
      }
    });
  }

  return app;
}
