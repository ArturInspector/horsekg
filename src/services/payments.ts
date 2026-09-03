import type { LabeledPrice, SuccessfulPayment } from "grammy/types";
import type { DbClient } from "../database.js";
import { DomainError } from "./errors.js";

const KGS_MINOR_UNITS = 100;

export type TelegramInvoice = {
  title: string;
  description: string;
  payload: string;
  currency: string;
  prices: LabeledPrice[];
  photoUrl?: string;
};

export class PaymentService {
  constructor(private readonly db: DbClient) {}

  async prepareTelegramInvoice(publicCode: string): Promise<TelegramInvoice> {
    const booking = await this.db.booking.findUnique({
      where: { publicCode },
      include: {
        horse: true,
        location: true,
        payment: true,
        ridePackage: true,
        slot: true
      }
    });

    if (!booking) {
      throw new DomainError("BOOKING_NOT_FOUND", "Бронь не найдена", 404);
    }

    if (booking.status === "CONFIRMED") {
      throw new DomainError("BOOKING_ALREADY_PAID", "Эта бронь уже оплачена");
    }

    await this.db.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        provider: "TELEGRAM",
        status: "PENDING",
        amountKgs: booking.totalAmountKgs,
        currency: "KGS",
        providerPayload: booking.publicCode
      },
      create: {
        bookingId: booking.id,
        provider: "TELEGRAM",
        status: "PENDING",
        amountKgs: booking.totalAmountKgs,
        currency: "KGS",
        providerPayload: booking.publicCode
      }
    });

    return {
      title: booking.ridePackage.title.slice(0, 32),
      description: `${booking.location.title}, ${booking.participants} чел.`,
      payload: booking.publicCode,
      currency: "KGS",
      prices: [
        {
          label: "Бронирование прогулки",
          amount: booking.totalAmountKgs * KGS_MINOR_UNITS
        }
      ],
      photoUrl: booking.horse?.photoUrl ?? undefined
    };
  }

  async markTelegramPaymentSucceeded(payment: SuccessfulPayment) {
    const booking = await this.db.booking.findUnique({
      where: { publicCode: payment.invoice_payload },
      include: { payment: true }
    });

    if (!booking) {
      throw new DomainError("BOOKING_NOT_FOUND", "Бронь не найдена", 404);
    }

    const paidAmountKgs = Math.round(payment.total_amount / KGS_MINOR_UNITS);

    return this.db.$transaction(async (tx) => {
      await tx.payment.upsert({
        where: { bookingId: booking.id },
        update: {
          status: "SUCCEEDED",
          amountKgs: paidAmountKgs,
          currency: payment.currency,
          providerPayload: payment.invoice_payload,
          telegramChargeId: payment.telegram_payment_charge_id,
          providerChargeId: payment.provider_payment_charge_id,
          rawProviderData: JSON.parse(JSON.stringify(payment))
        },
        create: {
          bookingId: booking.id,
          provider: "TELEGRAM",
          status: "SUCCEEDED",
          amountKgs: paidAmountKgs,
          currency: payment.currency,
          providerPayload: payment.invoice_payload,
          telegramChargeId: payment.telegram_payment_charge_id,
          providerChargeId: payment.provider_payment_charge_id,
          rawProviderData: JSON.parse(JSON.stringify(payment))
        }
      });

      return tx.booking.update({
        where: { id: booking.id },
        data: {
          status: "CONFIRMED",
          paidAmountKgs
        },
        include: {
          customer: true,
          horse: true,
          location: true,
          payment: true,
          ridePackage: true,
          slot: true
        }
      });
    });
  }
}
