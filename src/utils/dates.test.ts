import { describe, expect, it } from "vitest";
import { addDays, parseDate } from "./dates.js";

describe("date helpers", () => {
  it("adds calendar days without mutating the original date", () => {
    const original = new Date("2026-09-03T00:00:00.000Z");
    const result = addDays(original, 2);

    expect(result.toISOString()).toBe("2026-09-05T00:00:00.000Z");
    expect(original.toISOString()).toBe("2026-09-03T00:00:00.000Z");
  });

  it("parses valid dates and rejects invalid values", () => {
    expect(parseDate("2026-09-03T10:00:00.000Z")?.toISOString()).toBe(
      "2026-09-03T10:00:00.000Z"
    );
    expect(parseDate("not-a-date")).toBeUndefined();
    expect(parseDate(undefined)).toBeUndefined();
  });
});
