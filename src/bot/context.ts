import type { Context, SessionFlavor } from "grammy";
import { z } from "zod";

export type BookingDraft = {
  locationId?: string;
  packageId?: string;
  slotId?: string;
  horseId?: string;
  participants?: number;
  awaitingPhone?: boolean;
};

export type BotSession = {
  draft?: BookingDraft;
  source?: string;
};

export type BotContext = Context & SessionFlavor<BotSession>;

export const botSessionSchema = z.object({
  source: z.string().optional(),
  draft: z
    .object({
      locationId: z.string().optional(),
      packageId: z.string().optional(),
      slotId: z.string().optional(),
      horseId: z.string().optional(),
      participants: z.number().int().positive().optional(),
      awaitingPhone: z.boolean().optional()
    })
    .optional()
});

export function initialSession(): BotSession {
  return {};
}
