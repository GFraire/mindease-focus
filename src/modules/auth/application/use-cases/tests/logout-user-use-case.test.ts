import { describe, it, expect, vi, beforeEach } from "vitest";
import { LogoutUserUseCase } from "../logout-user-usecase";
import { type AuthRepository } from "../../../domain/repositories/auth-repository";

describe("LogoutUserUseCase", () => {
  let authRepository: AuthRepository;
  let logoutUserUseCase: LogoutUserUseCase;

  beforeEach(() => {
    authRepository = {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    };

    logoutUserUseCase = new LogoutUserUseCase(authRepository);
  });

  it("should call authRepository.logout", async () => {
    await logoutUserUseCase.execute();

    expect(authRepository.logout).toHaveBeenCalledTimes(1);
  });

  it("should resolve when repository resolves", async () => {
    authRepository.logout = vi.fn().mockResolvedValue(undefined);

    await expect(logoutUserUseCase.execute()).resolves.toBeUndefined();
  });

  it("should throw error when repository throws", async () => {
    authRepository.logout = vi
      .fn()
      .mockRejectedValue(new Error("Logout failed"));

    await expect(logoutUserUseCase.execute()).rejects.toThrow("Logout failed");
  });
});
