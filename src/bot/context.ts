import type { Context, SessionFlavor } from "grammy";
import { z } from "zod";
import type { MarketingAttribution } from "../services/analytics.js";

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
  attribution?: MarketingAttribution;
};

export type BotContext = Context & SessionFlavor<BotSession>;

export const botSessionSchema = z.object({
  source: z.string().optional(),
  attribution: z
    .object({
      clickId: z.string().optional(),
      source: z.string().optional(),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmContent: z.string().optional(),
      utmTerm: z.string().optional(),
      campaignId: z.string().optional(),
      adSetId: z.string().optional(),
      adId: z.string().optional(),
      fbclid: z.string().optional(),
      gclid: z.string().optional(),
      yclid: z.string().optional()
    })
    .optional(),
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
