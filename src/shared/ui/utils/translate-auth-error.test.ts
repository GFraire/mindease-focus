import { describe, it, expect } from "vitest";
import { translateAuthError } from "./translate-auth-error";

describe("translateAuthError", () => {
  it("should translate email already in use", () => {
    const error = { code: "auth/email-already-in-use" };

    const message = translateAuthError(error);

    expect(message).toBe("Este e-mail já está em uso.");
  });

  it("should return default message for unknown error", () => {
    const message = translateAuthError({ code: "unknown" });
    expect(message).toBe("Ocorreu um erro inesperado.");
  });
});
