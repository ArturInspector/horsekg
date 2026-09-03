import { randomBytes } from "node:crypto";
import type { DbClient } from "../database.js";
import { DomainError } from "./errors.js";

type TelegramUserInput = {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type CreateBookingInput = {
  telegramUser?: TelegramUserInput;
  slotId: string;
  horseId?: string;
  participants: number;
  contactPhone: string;
  contactName?: string;
  notes?: string;
  paymentExpected?: boolean;
};

function createPublicCode() {
  return `HS-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export class BookingService {
  constructor(private readonly db: DbClient) {}

  getBookingByPublicCode(publicCode: string) {
    return this.db.booking.findUnique({
      where: { publicCode },
      include: {
        customer: true,
        horse: true,
        location: true,
        payment: true,
        ridePackage: true,
        slot: true
      }
    });
  }

  listCustomerBookings(telegramUserId: number) {
    return this.db.booking.findMany({
      where: {
        customer: {
          telegramId: BigInt(telegramUserId)
        }
      },
      include: {
        horse: true,
        location: true,
        payment: true,
        ridePackage: true,
        slot: true
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });
  }

  async createBooking(input: CreateBookingInput) {
    if (input.participants < 1 || input.participants > 10) {
      throw new DomainError(
        "INVALID_PARTICIPANTS",
        "Количество участников должно быть от 1 до 10"
      );
    }

    return this.db.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: input.slotId },
        include: {
          location: true,
          ridePackage: true
        }
      });

      if (!slot) {
        throw new DomainError("SLOT_NOT_FOUND", "Слот не найден", 404);
      }

      if (slot.startsAt <= new Date()) {
        throw new DomainError("SLOT_CLOSED", "Этот слот уже недоступен");
      }

      if (input.participants > slot.ridePackage.maxParticipants) {
        throw new DomainError(
          "TOO_MANY_PARTICIPANTS",
          `Для этого маршрута максимум ${slot.ridePackage.maxParticipants} участников`
        );
      }

      const reserved = await tx.availabilitySlot.updateMany({
        where: {
          id: slot.id,
          seatsBooked: {
            lte: slot.capacity - input.participants
          }
        },
        data: {
          seatsBooked: {
            increment: input.participants
          }
        }
      });

      if (reserved.count !== 1) {
        throw new DomainError("SLOT_FULL", "На это время мест уже нет");
      }

      let horseId = input.horseId;

      if (horseId) {
        const horse = await tx.horse.findFirst({
          where: {
            id: horseId,
            status: "AVAILABLE",
            OR: [{ locationId: slot.locationId }, { locationId: null }]
          }
        });

        if (!horse) {
          throw new DomainError("HORSE_NOT_AVAILABLE", "Эта лошадь недоступна");
        }
      }

      const customer = input.telegramUser
        ? await tx.customer.upsert({
            where: {
              telegramId: BigInt(input.telegramUser.id)
            },
            update: {
              telegramUsername: input.telegramUser.username,
              firstName: input.telegramUser.firstName,
              lastName: input.telegramUser.lastName,
              phone: input.contactPhone
            },
            create: {
              telegramId: BigInt(input.telegramUser.id),
              telegramUsername: input.telegramUser.username,
              firstName: input.telegramUser.firstName,
              lastName: input.telegramUser.lastName,
              phone: input.contactPhone
            }
          })
        : await tx.customer.create({
            data: {
              firstName: input.contactName,
              phone: input.contactPhone
            }
          });

      const totalAmountKgs = slot.ridePackage.priceKgs * input.participants;
      const status = input.paymentExpected
        ? "PENDING_PAYMENT"
        : "PENDING_CONFIRMATION";
      const publicCode = createPublicCode();

      const booking = await tx.booking.create({
        data: {
          publicCode,
          status,
          participants: input.participants,
          contactName: input.contactName,
          contactPhone: input.contactPhone,
          notes: input.notes,
          totalAmountKgs,
          customerId: customer.id,
          locationId: slot.locationId,
          ridePackageId: slot.ridePackageId,
          slotId: slot.id,
          horseId,
          ...(input.paymentExpected
            ? {
                payment: {
                  create: {
                    provider: "TELEGRAM",
                    status: "PENDING",
                    amountKgs: totalAmountKgs,
                    currency: "KGS",
                    providerPayload: publicCode
                  }
                }
              }
            : {})
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

      return booking;
    });
  }
}
