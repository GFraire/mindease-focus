import { describe, it, expect } from "vitest";
import { translateAuthError } from "../translate-auth-error";

describe("translateAuthError", () => {
  it("should return user not found message", () => {
    const result = translateAuthError({ code: "auth/user-not-found" });
    expect(result).toBe("Usuário não encontrado.");
  });

  it("should return wrong password message", () => {
    const result = translateAuthError({ code: "auth/wrong-password" });
    expect(result).toBe("Senha incorreta.");
  });

  it("should return email already in use message", () => {
    const result = translateAuthError({ code: "auth/email-already-in-use" });
    expect(result).toBe("Este e-mail já está em uso.");
  });

  it("should return invalid credential message", () => {
    const result = translateAuthError({ code: "auth/invalid-credential" });
    expect(result).toBe("Credenciais inválidas.");
  });

  it("should return invalid email message", () => {
    const result = translateAuthError({ code: "auth/invalid-email" });
    expect(result).toBe("E-mail inválido.");
  });

  it("should return weak password message", () => {
    const result = translateAuthError({ code: "auth/weak-password" });
    expect(result).toBe("A senha deve ter no mínimo 6 caracteres.");
  });

  it("should return default message for unknown error", () => {
    const result = translateAuthError({ code: "unknown-error" });
    expect(result).toBe("Ocorreu um erro inesperado.");
  });

  it("should return default message for empty object", () => {
    const result = translateAuthError({});
    expect(result).toBe("Ocorreu um erro inesperado.");
  });

  it("should return default message for undefined", () => {
    const result = translateAuthError(undefined);
    expect(result).toBe("Ocorreu um erro inesperado.");
  });
});
