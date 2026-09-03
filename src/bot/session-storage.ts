import type { StorageAdapter } from "grammy";
import type { DbClient } from "../database.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { BotSession } from "./context.js";
import { botSessionSchema } from "./context.js";

function toJson(value: BotSession): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export class PrismaSessionStorage implements StorageAdapter<BotSession> {
  constructor(private readonly db: DbClient) {}

  async read(key: string) {
    const record = await this.db.telegramSession.findUnique({
      where: { key }
    });

    if (!record) {
      return undefined;
    }

    const parsed = botSessionSchema.safeParse(record.data);

    if (!parsed.success) {
      await this.delete(key);
      return undefined;
    }

    return parsed.data;
  }

  async write(key: string, value: BotSession) {
    await this.db.telegramSession.upsert({
      where: { key },
      update: { data: toJson(value) },
      create: {
        key,
        data: toJson(value)
      }
    });
  }

  async delete(key: string) {
    await this.db.telegramSession.deleteMany({
      where: { key }
    });
  }
}
