import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://horsesharing:horsesharing@localhost:5432/horsesharing?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
});

function addMinutes(date: Date, minutes: number) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

function atBishkekHour(dayOffset: number, hour: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + dayOffset);
  date.setUTCHours(hour - 6, 0, 0, 0);
  return date;
}

function twoGisSearchUrl(query: string) {
  return `https://2gis.kg/bishkek/search/${encodeURIComponent(query)}`;
}

async function main() {
  const chunkurchak = await prisma.location.upsert({
    where: { slug: "chunkurchak" },
    update: {
      latitude: 42.6619,
      longitude: 74.6002,
      mapUrl: twoGisSearchUrl("Чункурчакское ущелье")
    },
    create: {
      slug: "chunkurchak",
      title: "Чункурчак",
      description: "Горная прогулка недалеко от Бишкека для новичков и компаний.",
      address: "Чункурчакское ущелье",
      latitude: 42.6619,
      longitude: 74.6002,
      mapUrl: twoGisSearchUrl("Чункурчакское ущелье")
    }
  });

  const alamedin = await prisma.location.upsert({
    where: { slug: "alamedin" },
    update: {
      latitude: 42.6457,
      longitude: 74.7223,
      mapUrl: twoGisSearchUrl("Аламединское ущелье")
    },
    create: {
      slug: "alamedin",
      title: "Аламедин",
      description: "Маршруты вдоль ущелья, спокойный темп, подходит для первого раза.",
      address: "Аламединское ущелье",
      latitude: 42.6457,
      longitude: 74.7223,
      mapUrl: twoGisSearchUrl("Аламединское ущелье")
    }
  });

  const oneHour = await prisma.ridePackage.upsert({
    where: { slug: "chunkurchak-one-hour" },
    update: {},
    create: {
      slug: "chunkurchak-one-hour",
      title: "Прогулка 1 час",
      description: "Короткий маршрут с инструктором.",
      durationMinutes: 60,
      priceKgs: 1500,
      maxParticipants: 6,
      locationId: chunkurchak.id
    }
  });

  const twoHours = await prisma.ridePackage.upsert({
    where: { slug: "chunkurchak-two-hours" },
    update: {},
    create: {
      slug: "chunkurchak-two-hours",
      title: "Горный маршрут 2 часа",
      description: "Более длинный маршрут с остановками для фото.",
      durationMinutes: 120,
      priceKgs: 2800,
      maxParticipants: 5,
      locationId: chunkurchak.id
    }
  });

  const alamedinIntro = await prisma.ridePackage.upsert({
    where: { slug: "alamedin-intro" },
    update: {},
    create: {
      slug: "alamedin-intro",
      title: "Аламедин для новичков",
      description: "Спокойная прогулка по ущелью.",
      durationMinutes: 90,
      priceKgs: 2200,
      maxParticipants: 6,
      locationId: alamedin.id
    }
  });

  await prisma.horse.upsert({
    where: { slug: "ak-kula" },
    update: {},
    create: {
      slug: "ak-kula",
      name: "Ак-Кула",
      age: 7,
      color: "серая",
      description: "Спокойная, подходит новичкам.",
      photoUrl:
        "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80",
      status: "AVAILABLE",
      skillLevel: "BEGINNER",
      locationId: chunkurchak.id
    }
  });

  await prisma.horse.upsert({
    where: { slug: "boran" },
    update: {},
    create: {
      slug: "boran",
      name: "Боран",
      age: 9,
      color: "гнедой",
      description: "Уверенный конь для маршрутов 1-2 часа.",
      photoUrl:
        "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80",
      status: "AVAILABLE",
      skillLevel: "INTERMEDIATE",
      locationId: chunkurchak.id
    }
  });

  await prisma.horse.upsert({
    where: { slug: "karat" },
    update: {},
    create: {
      slug: "karat",
      name: "Карат",
      age: 6,
      color: "вороной",
      description: "Спокойный темп, хорошо идет с группой.",
      photoUrl:
        "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1200&q=80",
      status: "AVAILABLE",
      skillLevel: "BEGINNER",
      locationId: alamedin.id
    }
  });

  const packages = [oneHour, twoHours, alamedinIntro];

  for (const ridePackage of packages) {
    for (const dayOffset of [1, 2, 3, 4, 5, 6, 7]) {
      for (const hour of [10, 13, 16]) {
        const startsAt = atBishkekHour(dayOffset, hour);
        const endsAt = addMinutes(startsAt, ridePackage.durationMinutes);
        const existingSlot = await prisma.availabilitySlot.findFirst({
          where: {
            startsAt,
            ridePackageId: ridePackage.id
          }
        });

        if (existingSlot) {
          continue;
        }

        await prisma.availabilitySlot.create({
          data: {
            startsAt,
            endsAt,
            capacity: ridePackage.maxParticipants,
            locationId:
              ridePackage.slug === "alamedin-intro" ? alamedin.id : chunkurchak.id,
            ridePackageId: ridePackage.id
          }
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
