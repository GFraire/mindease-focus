import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterUserUseCase } from "../register-user-use-case";
import { type AuthRepository } from "../../../domain/repositories/auth-repository";

describe("RegisterUserUseCase", () => {
  let authRepository: AuthRepository;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    authRepository = {
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    };

    registerUserUseCase = new RegisterUserUseCase(authRepository);
  });

  it("should call repository register method", async () => {
    await registerUserUseCase.execute({
      fullName: "Gabriel Freire",
      email: "gabriel@email.com",
      password: "12345678",
    });

    expect(authRepository.register).toHaveBeenCalledWith({
      fullName: "Gabriel Freire",
      email: "gabriel@email.com",
      password: "12345678",
    });
  });

  it("should throw if repository throws", async () => {
    authRepository.register = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(
      registerUserUseCase.execute({
        fullName: "Gabriel",
        email: "gabriel@email.com",
        password: "12345678",
      }),
    ).rejects.toThrow("fail");
  });
});
