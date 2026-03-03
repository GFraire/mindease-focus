import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginUserUseCase } from "../login-user-usecase";
import { User } from "../../../domain/entities/user";

import { type AuthRepository } from "../../../domain/repositories/auth-repository";

describe("LoginUserUseCase", () => {
  let authRepository: AuthRepository;
  let loginUserUseCase: LoginUserUseCase;

  beforeEach(() => {
    authRepository = {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    };

    loginUserUseCase = new LoginUserUseCase(authRepository);
  });

  it("should call authRepository.login with correct data", async () => {
    const data = { email: "test@email.com", password: "123456" };

    await loginUserUseCase.execute(data);

    expect(authRepository.login).toHaveBeenCalledWith(data);
  });

  it("should return user when login succeeds", async () => {
    const fakeUser = new User("1", "test@email.com", "Gabriel");

    authRepository.login = vi.fn().mockResolvedValue(fakeUser);

    const result = await loginUserUseCase.execute({
      email: "test@email.com",
      password: "123456",
    });

    expect(result).toBe(fakeUser);
  });

  it("should throw error when repository throws", async () => {
    authRepository.login = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    await expect(
      loginUserUseCase.execute({
        email: "test@email.com",
        password: "wrong",
      }),
    ).rejects.toThrow("Invalid credentials");
  });
});
