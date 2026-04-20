import { describe, it, expect } from "vitest";
import { checkUsername, checkPassword } from "../helpers.js";

const captureError = (fn) => {
  try {
    fn();
    return null;
  } catch (error) {
    return error;
  }
};

describe("helpers validation", () => {
  it("accepts a valid username", () => {
    const result = checkUsername("test_user", "test");

    expect(result).toBe("test_user");
  });

  it("rejects invalid username characters", () => {
    const error = captureError(() => checkUsername("bad!name", "test"));

    expect(error.error).toMatch(/Invalid username/);
  });

  it("rejects passwords without required character types", () => {
    const error = captureError(() => checkPassword("Password1", "test"));

    expect(error.error).toMatch(/must contain at least 1 uppercase letter/);
  });
});
