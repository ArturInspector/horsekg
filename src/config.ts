import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const optionalString = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).optional()
);

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().trim().url().optional()
);

const optionalNumber = (fallback: number) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(fallback)
  );

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  HOST: z.preprocess(emptyToUndefined, z.string().default("0.0.0.0")),
  PORT: optionalNumber(3000),
  DATABASE_URL: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .min(1)
      .default(
        "postgresql://horsesharing:horsesharing@localhost:5432/horsesharing?schema=public"
      )
  ),
  TELEGRAM_BOT_TOKEN: optionalString,
  TELEGRAM_BOT_MODE: z
    .enum(["polling", "webhook", "disabled"])
    .default("polling"),
  TELEGRAM_WEBHOOK_PATH: z.preprocess(
    emptyToUndefined,
    z.string().startsWith("/").default("/telegram/webhook")
  ),
  TELEGRAM_WEBHOOK_SECRET: optionalString,
  APP_URL: optionalUrl,
  PAYMENTS_PROVIDER_TOKEN: optionalString,
  MANAGER_CHAT_ID: optionalString,
  BOOKING_HOLD_MINUTES: optionalNumber(30)
});

const env = envSchema.parse(process.env);

if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_BOT_MODE === "webhook" && !env.APP_URL) {
  throw new Error("APP_URL is required when TELEGRAM_BOT_MODE=webhook");
}

export const config = {
  nodeEnv: env.NODE_ENV,
  host: env.HOST,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  telegramBotToken: env.TELEGRAM_BOT_TOKEN,
  telegramBotMode: env.TELEGRAM_BOT_MODE,
  telegramWebhookPath: env.TELEGRAM_WEBHOOK_PATH,
  telegramWebhookSecret: env.TELEGRAM_WEBHOOK_SECRET,
  appUrl: env.APP_URL?.replace(/\/$/, ""),
  paymentsProviderToken: env.PAYMENTS_PROVIDER_TOKEN,
  managerChatId: env.MANAGER_CHAT_ID,
  bookingHoldMinutes: env.BOOKING_HOLD_MINUTES
} as const;

export type AppConfig = typeof config;
