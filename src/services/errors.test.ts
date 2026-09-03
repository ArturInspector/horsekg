import { describe, expect, it } from "vitest";
import { DomainError } from "./errors.js";

describe("DomainError", () => {
  it("keeps API-safe error metadata", () => {
    const error = new DomainError("SLOT_FULL", "На это время мест уже нет", 409);

    expect(error.name).toBe("DomainError");
    expect(error.code).toBe("SLOT_FULL");
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe("На это время мест уже нет");
  });
});
