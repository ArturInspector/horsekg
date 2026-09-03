import type { DbClient } from "../database.js";
import { addDays } from "../utils/dates.js";
import { DomainError } from "./errors.js";

type ListSlotsInput = {
  locationId: string;
  packageId: string;
  from?: Date;
  to?: Date;
  limit?: number;
};

export class CatalogService {
  constructor(private readonly db: DbClient) {}

  listLocations() {
    return this.db.location.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" }
    });
  }

  async getLocation(id: string) {
    const location = await this.db.location.findFirst({
      where: { id, isActive: true }
    });

    if (!location) {
      throw new DomainError("LOCATION_NOT_FOUND", "Локация не найдена", 404);
    }

    return location;
  }

  listHorses(locationId?: string) {
    return this.db.horse.findMany({
      where: {
        status: "AVAILABLE",
        ...(locationId ? { locationId } : {})
      },
      include: { location: true },
      orderBy: { name: "asc" }
    });
  }

  listRidePackages(locationId?: string) {
    return this.db.ridePackage.findMany({
      where: {
        isActive: true,
        ...(locationId
          ? { OR: [{ locationId }, { locationId: null }] }
          : {})
      },
      include: { location: true },
      orderBy: [{ priceKgs: "asc" }, { durationMinutes: "asc" }]
    });
  }

  async listSlots(input: ListSlotsInput) {
    const from = input.from ?? new Date();
    const to = input.to ?? addDays(from, 14);
    const limit = input.limit ?? 12;

    const slots = await this.db.availabilitySlot.findMany({
      where: {
        locationId: input.locationId,
        ridePackageId: input.packageId,
        startsAt: {
          gte: from,
          lte: to
        }
      },
      include: {
        horse: true,
        location: true,
        ridePackage: true
      },
      orderBy: { startsAt: "asc" },
      take: Math.max(limit * 2, limit)
    });

    return slots
      .filter((slot) => slot.capacity - slot.seatsBooked > 0)
      .slice(0, limit);
  }
}
