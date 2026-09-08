import { expect, test } from "@playwright/test";

const commercialPages = [
  "/routes",
  "/prices",
  "/for-beginners",
  "/with-kids",
  "/instagram",
  "/blog",
];

test("desktop landing keeps route choices in the first viewport", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop layout guard.");

  await page.goto("/");

  const hero = page.locator(".v2Hero");
  const routeChoices = hero.getByLabel("Популярные маршруты");
  const heroImage = hero.locator(".outdoorHeroMedia img");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Конные прогулки в Бишкеке",
    }),
  ).toBeVisible();
  await expect(routeChoices).toBeVisible();
  await expect(routeChoices.locator(".heroRouteChoice")).toHaveCount(3);
  await expect(heroImage).toBeVisible();
  await expect(hero.locator(".bookingPanel")).toHaveCount(0);

  const metrics = await page.evaluate(() => {
    const heroBox = document.querySelector(".v2Hero")?.getBoundingClientRect();
    const routesBox = document.querySelector("#routes")?.getBoundingClientRect();
    const mediaBox = document
      .querySelector(".outdoorHeroMedia")
      ?.getBoundingClientRect();

    return {
      heroHeight: heroBox?.height ?? 0,
      mediaHeight: mediaBox?.height ?? 0,
      routesTop: routesBox?.top ?? 0,
    };
  });

  expect(metrics.mediaHeight).toBeGreaterThan(520);
  expect(metrics.heroHeight).toBeLessThan(760);
  expect(metrics.routesTop).toBeLessThan(840);
});

test("mobile landing puts photo before route choices", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout guard.");

  await page.goto("/");

  const order = await page.evaluate(() => {
    const routeChoicesBox = document
      .querySelector(".heroRouteList")
      ?.getBoundingClientRect();
    const mediaBox = document
      .querySelector(".outdoorHeroMedia")
      ?.getBoundingClientRect();

    return {
      mediaTop: mediaBox?.top ?? 0,
      routeChoicesTop: routeChoicesBox?.top ?? 0,
    };
  });

  expect(order.mediaTop).toBeLessThan(order.routeChoicesTop);
  await expect(page.locator(".mobileBookingBar")).toBeVisible();
  await expect(page.locator(".mobileBookingBar")).toContainText("Проверить");
});

test("mobile booking picker stores selected Telegram intent", async ({
  page,
}) => {
  await page.goto("/");

  const picker = page.locator("#booking .bookingPanel");

  await picker.getByRole("button", { name: "Аламедин" }).click();
  await picker.getByRole("button", { name: "3-6" }).click();
  await picker.getByRole("button", { name: "2 часа" }).click();

  const metadata = await picker
    .locator("a[data-analytics-target='quick_booking']")
    .getAttribute("data-analytics-metadata");

  expect(metadata).toContain('"bookingIntent"');
  expect(metadata).toContain('"location":"Аламедин"');
  expect(metadata).toContain('"participants":"3-6"');
  expect(metadata).toContain('"duration":"2 часа"');
  expect(metadata).toContain('"selectedSlot":"10:00"');
  expect(metadata).toContain('"availabilityStatus":"request"');
  expect(metadata).toContain('"confirmationMode":"manager_confirmation"');
  expect(metadata).toContain('"capacityMax":6');
});

for (const path of commercialPages) {
  test(`commercial page ${path} renders Telegram booking entry`, async ({
    page,
  }) => {
    await page.goto(path);

    await expect(page.locator("main")).toBeVisible();
    await expect(
      page.locator("a[href*='t.me/horsekgbot']").first(),
    ).toBeVisible();
  });
}
