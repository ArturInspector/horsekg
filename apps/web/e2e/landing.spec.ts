import { expect, test } from "@playwright/test";

const publicPages = [
  "/routes",
  "/prices",
  "/for-beginners",
  "/with-kids",
  "/instagram",
  "/blog",
];

test("desktop home is a booking product with a complete selection flow", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop layout guard.");

  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Выберите прогулку[\s\S]*Остальное мы устроим/,
    }),
  ).toBeVisible();
  await expect(page.locator(".bookingHero > img")).toBeVisible();
  await expect(page.locator(".searchPanel")).toBeVisible();
  await expect(page.locator(".rideResult")).toHaveCount(3);
  await expect(page.locator(".timeChips button")).toHaveCount(5);
  await expect(page.locator(".horseMapMarker")).toHaveCount(2);
  await expect(page.locator(".mapLocationActions a[href*='2gis.kg']")).toHaveCount(2);

  await page.locator(".timeChips button").first().click();
  await expect(page.locator(".selectionBar")).toBeVisible();
  await expect(page.locator(".selectionBar")).toContainText("3 000 сом");

  await page.locator(".selectionBar > button").click();
  await expect(page.locator(".checkoutSheet")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Куда прислать подтверждение?" })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const heroBox = document.querySelector(".bookingHero")?.getBoundingClientRect();
    const searchBox = document.querySelector(".searchPanel")?.getBoundingClientRect();

    return {
      heroHeight: heroBox?.height ?? 0,
      searchTop: searchBox?.top ?? 0,
    };
  });

  expect(metrics.heroHeight).toBeGreaterThan(540);
  expect(metrics.heroHeight).toBeLessThan(740);
  expect(metrics.searchTop).toBeLessThan(metrics.heroHeight + 20);
});

test("mobile home keeps selection in one continuous scroll", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout guard.");

  await page.goto("/");

  await expect(page.locator(".bookingHero > img")).toBeVisible();
  await expect(page.locator(".rideResult")).toHaveCount(3);
  await expect(page.locator(".searchPanel")).toBeVisible();
  await expect(page.locator(".horseMapMarker")).toHaveCount(2);

  const order = await page.evaluate(() => {
    const hero = document.querySelector(".bookingHero")?.getBoundingClientRect();
    const search = document.querySelector(".searchPanel")?.getBoundingClientRect();
    const results = document.querySelector(".resultsSection")?.getBoundingClientRect();

    return {
      heroTop: hero?.top ?? 0,
      searchTop: search?.top ?? 0,
      resultsTop: results?.top ?? 0,
    };
  });

  expect(order.heroTop).toBeLessThan(order.searchTop);
  expect(order.searchTop).toBeLessThan(order.resultsTop);

  await page.locator(".timeChips button").first().click();
  await expect(page.locator(".selectionBar")).toBeVisible();
  await page.locator(".selectionBar > button").click();
  await expect(page.locator(".checkoutSheet")).toBeVisible();
});

test("map location card filters matching rides", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".horseMapMarker")).toHaveCount(2);
  await page
    .locator(".mapLocationList article")
    .filter({ hasText: "Аламедин" })
    .getByRole("button", { name: /Смотреть прогулки/ })
    .click();

  await expect(page.locator(".locationControl select")).toHaveValue("Аламедин");
  await expect(page.locator(".rideResult")).toHaveCount(1);
  await expect(page.locator(".rideResult")).toContainText("Аламедин");
});

for (const path of publicPages) {
  test(`public page ${path} renders new shell and Telegram entry`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator("main.sitePage")).toBeVisible();
    await expect(page.locator(".siteHeader")).toBeVisible();
    await expect(page.locator("a[href*='t.me/horsekgbot']").first()).toBeVisible();
    await expect(page.locator(".bookingPanel")).toHaveCount(0);
    await expect(page.locator(".slotGrid")).toHaveCount(0);
  });
}
