import "dotenv/config";
import { config } from "./config.js";
import { createBot } from "./bot/index.js";
import { prisma } from "./database.js";
import { buildServer } from "./http/server.js";

async function configureBotCommands() {
  if (!config.telegramBotToken) {
    return undefined;
  }

  const bot = createBot({
    config,
    db: prisma
  });

  await bot.init();
  await bot.api.setMyCommands([
    { command: "start", description: "Главное меню" },
    { command: "book", description: "Записаться на прогулку" },
    { command: "horses", description: "Посмотреть лошадей" },
    { command: "locations", description: "Локации и карта" },
    { command: "my", description: "Мои брони" }
  ]);

  return bot;
}

async function main() {
  const bot =
    config.telegramBotMode === "disabled"
      ? undefined
      : await configureBotCommands();

  const app = await buildServer({
    bot,
    config,
    db: prisma
  });

  await app.listen({
    host: config.host,
    port: config.port
  });

  if (!bot) {
    app.log.info("Telegram bot is disabled or TELEGRAM_BOT_TOKEN is missing");
  } else if (config.telegramBotMode === "webhook") {
    const webhookUrl = `${config.appUrl}${config.telegramWebhookPath}`;

    await bot.api.setWebhook(webhookUrl, {
      secret_token: config.telegramWebhookSecret
    });
    app.log.info({ webhookUrl }, "Telegram webhook configured");
  } else {
    void bot.start({
      onStart: (info) => {
        app.log.info({ username: info.username }, "Telegram bot polling started");
      }
    });
  }

  const shutdown = async (signal: NodeJS.Signals) => {
    app.log.info({ signal }, "Shutting down");
    bot?.stop();
    await app.close();
    await prisma.$disconnect();
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
