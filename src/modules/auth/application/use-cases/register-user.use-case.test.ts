import { describe, it, expect, vi } from "vitest";
import { RegisterUserUseCase } from "./register-user.use-case";
import { type AuthRepository } from "../../domain/repositories/auth-repository";

describe("RegisterUserUseCase", () => {
  it("should call repository register method", async () => {
    const repositoryMock: AuthRepository = {
      register: vi.fn().mockResolvedValue(undefined),
    };

    const useCase = new RegisterUserUseCase(repositoryMock);

    await useCase.execute({
      fullName: "Gabriel Freire",
      email: "gabriel@email.com",
      password: "12345678",
    });

    expect(repositoryMock.register).toHaveBeenCalledWith({
      fullName: "Gabriel Freire",
      email: "gabriel@email.com",
      password: "12345678",
    });
  });

  it("should throw if repository throws", async () => {
    const repositoryMock = {
      register: vi.fn().mockRejectedValue(new Error("fail")),
    };

    const useCase = new RegisterUserUseCase(repositoryMock as any);

    await expect(
      useCase.execute({
        fullName: "Gabriel",
        email: "gabriel@email.com",
        password: "12345678",
      }),
    ).rejects.toThrow("fail");
  });
});
